import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { instructorDocument } from 'src/instructors/instructor.schema';
import { InstructorsService } from 'src/instructors/instructors.service';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class InstructorauthService {

    constructor(private readonly instructorService:InstructorsService,private readonly cloudinary:CloudinaryService,private jwtService:JwtService){}
    
        async registerinstructor(name:string,emailaddress:string,password:string,certificate:Express.Multer.File){
             let existingUser=await this.instructorService.findByEmail(emailaddress)
             if(existingUser){
                throw new BadRequestException('User already exists')
             }
    
             let certificateUrl=await this.cloudinary.UploadedFile(certificate)
    
             const registered=await this.instructorService.createInstructor(name,emailaddress,password,certificateUrl)

             await this.sendinstructorotp(emailaddress)
    
             return registered
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
            console.log('hello machy',instructor)
            if(!instructor){
                throw new BadRequestException('invalid instructor')
            }

            console.log('Comparing:', {
                storedEmail: instructor.emailaddress,
                receivedEmail: emailaddress,
                storedOtp: instructor.otp,
                receivedOtp: otp,
                storedOtpExpires: instructor.otpExpires
            });
    
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

             if(instructor.isBlocked){
                throw new BadRequestException('Your account has been blocked')
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
    
    

        //gonna do forgot password
        async forgotpassInstructor(emailaddress:string){
            let instructor =await this.instructorService.findByEmail(emailaddress)
            if(!instructor){
                throw new BadRequestException('Instructor not found')
            }

            const token=this.jwtService.sign({InstructorId:instructor._id.toString()},{secret:process.env.JWT_SECRET_KEY as string,expiresIn:'15 m'})

            const transporter=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:process.env.EMAIL_USER,
                    pass:process.env.EMAIL_PASS
                }
            })


            const resetlink=`${process.env.FRONTEND_URL}/instructorresetpassword/${token}`

            transporter.sendMail({
                from:process.env.EMAIL_USER,
                to:emailaddress,
                subject:'Password Reset',
                text:`click on the link to reset your password ${resetlink} ONLY valid for 15 minutes remember`
            })

            return {message:'Reset link sent successfully'}
        }



        //resetting password for instructort
        async resetPasswordInstructor(token:string,password:string){
            try {
                const decoded=this.jwtService.verify(token,{secret:process.env.JWT_SECRET_KEY as string}) as {InstructorId:string}
                
                let instructor=await this.instructorService.findById(decoded.InstructorId)
                if(!instructor){
                    throw new BadRequestException('instructor not found')
                }
                const hashedpassword=await bcrypt.hash(password,10)

                await this.instructorService.updatePassword(instructor.emailaddress,hashedpassword)

                return {message:'password reseted successfully'}

            } catch (error) {
                throw new BadRequestException('invalid or expired token')
            }
        }


       
}
