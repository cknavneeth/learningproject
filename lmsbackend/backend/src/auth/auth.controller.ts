import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {

    constructor(private readonly authservice:AuthService){}

    @Post('register')
    async register(@Body() body:{username:string,email:string,password:string}){
      return  this.authservice.register(body.username,body.email,body.password)
    }

    @Post('sendotp')
    async sendotp(@Body() body:{email:string}){
        if (!body || !body.email) {
            throw new BadRequestException('Email is required');
          }
           return this.authservice.sendOtp(body.email)
    }


    @Post('verifyotp')
    async verifyotp(@Body() body:{email:string,otp:string}){
        if(!body.email || !body.otp){
          throw new BadRequestException('there is no email and otp')
        }
        return this.authservice.verifyotp(body.email,body.otp)
    }


    @Post('login')
    async login(@Body() body:{email:string,password:string},@Res() res:Response){
        if(!body.email || !body.password){
          throw new BadRequestException('No email and password')
        }
        const {accesstoken,refreshtoken,message}=await this.authservice.login(body.email,body.password,res )

       return res.json({accesstoken,message})
    }
}
