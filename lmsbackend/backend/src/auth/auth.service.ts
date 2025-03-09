import { BadGatewayException, BadRequestException, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as nodemailer from 'nodemailer';
import { Subject } from 'rxjs';
import { user, userDocument } from 'src/users/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { InstructorsService } from 'src/instructors/instructors.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { instructorDocument } from 'src/instructors/instructor.schema';






@Injectable()
export class AuthService {

    constructor(private readonly userservice:UsersService,private readonly cloudinary:CloudinaryService,private readonly instructorService:InstructorsService){}

    private accessToken:string|null=null

    async register(username:string,email:string,password:string){
        let existinguser=await this.userservice.findByEmail(email)
        if(existinguser){
            throw new BadRequestException('user already exists')
        }
        return this.userservice.createUser(username,email,password)
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

    generateAccessToken(user:userDocument){
       return jwt.sign({userId:user._id.toString(),email:user.email},process.env.JWT_SECRET_KEY as string,{expiresIn:process.env.JWT_EXPIRES_IN})
    }


    generateRefreshToken(user:user){
        return jwt.sign({userId:user._id,email:user.email},process.env.REFRESH_TOKEN_SECRET as string,{expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN})
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


    async registerinstructor(name:string,emailaddress:string,password:string,certificate:Express.Multer.File){
         let existingUser=await this.userservice.findByEmail(emailaddress)
         if(existingUser){
            throw new BadRequestException('User already exists')
         }

         console.log('rone',emailaddress)

         let certificateUrl=await this.cloudinary.UploadedFile(certificate)

         return this.instructorService.createInstructor(name,emailaddress,password,certificateUrl)


    }



    async sendinstructorotp(emailaddress:string){
        let instructor=await this.instructorService.findByEmail(emailaddress)
        if(!instructor){
            throw new BadRequestException('Instructor not exists')
        }

        const otp=Math.floor(100000 +Math.random()*900000).toString()
        const otpExpires=new Date()

        otpExpires.setMinutes(otpExpires.getMinutes()+5)

        instructor.otp=otp
        instructor.otpExpires=otpExpires

        await this.instructorService.updateinstructor(emailaddress,{otp,otpExpires})

        await this.sendMail(emailaddress,otp)

        return {message:'otp sented successfully'}
    }

    async verifyinstructorotp(emailaddress:string,otp:string){
        console.log('call backendil ethi')
        let instructor=await this.instructorService.findByEmail(emailaddress)
        if(!instructor){
            throw new BadRequestException('invalid instructor')
        }

        if(!instructor.otp|| !instructor.otpExpires){
            throw new BadRequestException('invalid request')
        }

        const now=new Date()
        if(instructor.otp!==otp || now>instructor.otpExpires){
            throw new BadRequestException('invalid otp')
        }

        instructor.isVerified=true
        instructor.otp=null
        instructor.otpExpires=null

        await instructor.save()

        return {message:'Otp verified successfully'}
    }





    async instructorLogin(emailaddress:string,password:string,res:Response){
        console.log('serviceil call ethyo')
         let instructor=await this.instructorService.findByEmail(emailaddress)
         if(!instructor){
            throw new BadRequestException('There is no user')
         }
         if(!instructor.isVerified){
            throw new BadRequestException('instructor is not verified')
         }

         let isPasswordvalid=await this.instructorService.comparePassword(password,instructor.password)

         if(!isPasswordvalid){
            throw new BadRequestException('password is not matching')
         }

         const accesstoken=this.generateInstructorAccess(instructor)
         const refreshtoken=this.generateInstructorRefresh(instructor)


         res.cookie('instructor_refreshToken', refreshtoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

          console.log('access token aykan ponu')

          return res.status(200).json({
            accesstoken,
            message: 'Instructor logged in successfully'
        });

    }

    generateInstructorAccess(instructor:instructorDocument){
        return jwt.sign({InstructorId:instructor._id.toString(),emailaddress:instructor.emailaddress},process.env.JWT_SECRET_KEY as string,{expiresIn:process.env.JWT_EXPIRES_IN})
    }
    generateInstructorRefresh(instructor:instructorDocument){
       return jwt.sign({InstructorId:instructor._id.toString(),emailaddress:instructor.emailaddress},process.env.REFRESH_TOKEN_SECRET as string,{expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN})
    }



    async accesstokenretry(refreshtoken:string){
        try {
            const payload=jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET as string) as {InstructorId:string}

           let instructor=await this.instructorService.findById(payload.InstructorId)

           if(!instructor){
              throw new BadRequestException('invalid refresh token')
           }

        return this.generateInstructorAccess(instructor)
            
        } catch (error) {
            throw new BadRequestException('Error while accessing token')
        }
        
    }
}
