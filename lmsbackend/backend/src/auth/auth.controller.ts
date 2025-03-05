import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

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
}
