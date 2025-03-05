import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as nodemailer from 'nodemailer';
import { Subject } from 'rxjs';




@Injectable()
export class AuthService {

    constructor(private readonly userservice:UsersService){}

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
}
