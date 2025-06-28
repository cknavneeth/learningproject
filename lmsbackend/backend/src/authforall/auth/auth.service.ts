import { BadGatewayException, BadRequestException, Injectable, Logger, Res, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as nodemailer from 'nodemailer';
import { Subject } from 'rxjs';
import { user, userDocument } from 'src/users/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { InstructorsService } from 'src/instructors/instructors.service';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { instructorDocument } from 'src/instructors/instructor.schema';
import { AdminService } from 'src/admin/admin.service';
import * as bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library';






@Injectable()
export class AuthService {

    private logger=new Logger()

    private googleClient:OAuth2Client

    constructor(private readonly userservice:UsersService,private readonly cloudinary:CloudinaryService,private readonly instructorService:InstructorsService ,private readonly adminService:AdminService,private jwtService:JwtService,private readonly configservice:ConfigService){
        this.googleClient=new OAuth2Client(this.configservice.get<string>('GOOGLE_CLIENT_ID'))
    }

    private accessToken:string|null=null
   

    async register(username:string,email:string,password:string){
        let existinguser=await this.userservice.findByEmail(email)
        if(existinguser){
            throw new BadRequestException('user already exists')
        }
        
        await this.userservice.createUser(username,email,password)
        await this.sendOtp(email)
        // return registered
        return {message:'Registration successfull,OTP is in email'}
    }

    async sendOtp(email:string){
        let user=await this.userservice.findByEmail(email)
        if(!user){
            throw new BadRequestException('user is not found')
        }
        const otp=Math.floor(100000 +Math.random()*900000).toString()
        const otpExpires=new Date()
        otpExpires.setMinutes(otpExpires.getMinutes()+5)

        user.otp=otp
        user.otpExpires=otpExpires


        await this.userservice.updateUser(email,{otp,otpExpires})

        await this.sendMail(email,otp)

        return {message:'otp sent successfully'}
    }

    async sendMail(email:string,otp:string){
        const transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        })

        console.log('sukano',transporter)

        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,
            Subject:'your otp is here',
            text:`your otp is this ${otp},valid for 5 minutes`
        }

        await transporter.sendMail(mailOptions)
    }


    async verifyotp(email:string,otp:string){
        let user=await this.userservice.findByEmail(email)
        if(!user || !user.otp || !user.otpExpires){
            throw new BadRequestException('invalid request')
        }

        const now =new Date()
        if(user.otp!==otp || now>user.otpExpires){
            throw new BadRequestException('invalid or expired otp')
        }

      
       user.isVerified=true
       user.otp=null
       user.otpExpires=null

       await user.save()

       return {message:'otp verified successfully'}
    }



    //for login form
    async login(email:string,password:string,res:Response){
        let user=await this.userservice.findByEmail(email)
        if(!user){
            throw new BadRequestException('User not found')
        }

        if(user.isBlocked){
            throw new BadRequestException('Your account has been Blocked')
        }

        if(!user.isVerified){
            throw new BadRequestException('User is not verified')
        }

        let isPasswordvalid=await this.userservice.comparePassword(password,user.password)
        if(!isPasswordvalid){
            throw new BadRequestException('Password is not matching')
        }

        const accesstoken=this.generateAccessToken(user)
        const refreshtoken=this.generateRefreshToken(user)

        this.setAccessToken(accesstoken)

        res.cookie('refreshToken', refreshtoken, {
            httpOnly: true,  
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000, 
          });

          return {accesstoken,refreshtoken,message:'Login successfull'}
    }

    generateAccessToken(user:user|userDocument){
       return jwt.sign({userId:user._id.toString(),email:user.email,role:user.role||'student',username:user.username},process.env.JWT_SECRET_KEY as string,{expiresIn:process.env.JWT_EXPIRES_IN})
    }


    generateRefreshToken(user:user|userDocument){
        return jwt.sign({userId:user._id,email:user.email,role:user.role||'student',username:user.username},process.env.REFRESH_TOKEN_SECRET as string,{expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN})
    }


    setAccessToken(token:string){
       this.accessToken=token
    }
  
    getAccessToken():string | null{
       return this.accessToken
    }


    async refreshaccesstoken(refreshtoken:string):Promise<string>{
        try {
            let payload=jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET as string) as {userId:string}

            const user=await this.userservice.findById(payload.userId)
  
            if(!user){
              throw new UnauthorizedException({
                message:'invalide refresh token',
                error:'invalidTokenError'
              })
            }

            if(user.isBlocked){
                throw new UnauthorizedException({
                    message:'Your account has been blocked',
                    error:'invalidTokenError'
                })
            }
            return this.generateAccessToken(user)
        } catch (error) {

            if(error instanceof jwt.JsonWebTokenError){
                throw new UnauthorizedException({
                    message:'invalid refresh token',
                    error:'JsonWebTokenError'
                })
            }else if(error instanceof jwt.TokenExpiredError){
                throw new UnauthorizedException({
                    message:'refresh token expires',
                    error:'TokenExpiredError'
                })
            }
            else {
                throw new UnauthorizedException({
                    message: 'Authentication failed',
                    name: 'UnknownError'
                });
            }
        } 
    }



    //here iam doing forgotpassword
    async forgotpassword(email:string){
        let user=await this.userservice.findByEmail(email)
        if(!user){
            throw new BadRequestException('user not found')
        }
        const token=this.jwtService.sign({userId:user._id.toString()},{secret:process.env.JWT_SECRET_KEY as string,expiresIn:'15m'})

        const transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        })
        
        const resetlink=`${process.env.FRONTEND_URL}/resetpassword/${token}`

        transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:email,
            subject:'Password Reset',
            text:`click on the link to reset your password ${resetlink} ONLY valid for 15 minutes remember`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>Click the button below to reset your password:</p>
                    <a href="${resetlink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                    <p style="color: red; margin-top: 20px;">Link is ONLY valid for 15 minutes</p>
                </div>
            `
        })

        return {message:'reset link sented successfully'}
    }


   //for reset password
   async resetPasswordStudent(token:string,password:string){
    try {
        const decoded=this.jwtService.verify(token,{secret:process.env.JWT_SECRET_KEY as string}) as {userId:string}
        
        let student=await this.userservice.findById(decoded.userId)
        if(!student){
            throw new BadRequestException('user not found')
        }
        const hashedpassword=await bcrypt.hash(password,10)

        await this.userservice.updatepassword(student.id,hashedpassword)

        return {message:'password reseted successfully'}

    } catch (error) {
        throw new BadRequestException('invalid or expired token')
    }
   }



   //for google authentication
   async handleGoogleSignIn(credential:string,res:Response){
    this.logger.log('handling google sign in for you')
    try{
       const ticket=await this.googleClient.verifyIdToken({
        idToken:credential,
        audience:this.configservice.get<string>('GOOGLE_CLIENT_ID')
       })

       const payload=ticket.getPayload()

       this

       if(!payload || !payload.email){
          throw new BadRequestException('Invalid google Token')
       }

       const {email,name,email_verified,sub:googleId}=payload
       if(!email_verified){
        throw new BadRequestException('Email not verified')
       }

       let user=await this.userservice.findByEmail(email)

       if (user && !user.googleId) {
        throw new BadRequestException('Email already exists. Please use regular login');
    }

       if (!user) {
        const randomPassword = this.generateRandomPassword();
        user = await this.userservice.createGoogleUser(
            name || email.split('@')[0],
            email,
            randomPassword,
            googleId
        );
    }


    // const accesstoken = jwt.sign(
    //     { userId: user?._id.toString(), email: user?.email },
    //     process.env.JWT_SECRET_KEY as string,
    //     { expiresIn: process.env.JWT_EXPIRES_IN }
    // );

    const accesstoken=this.generateAccessToken(user!)
    const refreshtoken=this.generateRefreshToken(user!)

    // const refreshtoken = jwt.sign(
    //     { userId: user?._id.toString(), email: user?.email },
    //     process.env.REFRESH_TOKEN_SECRET as string,
    //     { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    // );

       res.cookie('refreshToken', refreshtoken, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           sameSite: 'strict',
           maxAge: 7 * 24 * 60 * 60 * 1000
       });

       return res.json({
           accesstoken,
           refreshtoken,
           message: 'Google sign-in successful'
       });
    }catch(error){
         throw new BadRequestException('Invalid google Token')
    }
   }


   private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8) + 
           Math.random().toString(36).slice(-8);
}
   
}
