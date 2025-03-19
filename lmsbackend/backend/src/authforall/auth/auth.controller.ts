import { BadRequestException, Body, Controller, Get, Param, Post, Req, Res, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import {Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Certificate } from 'crypto';
import * as multer from 'multer';
import { strict } from 'assert';

@Controller('auth/student')
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
      console.log('hello how are you my boy',body.email,body.otp)
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


    @Post('refreshtoken')
    async refreshtoken(@Req() req:Request,@Res() res:Response){

      try {
        const refreshtoken=req.cookies.refreshToken
         if(!refreshtoken){
          return res.status(401).json({success:false,message:'refresh token is not available'})
         }

         const newaccesstoken=await this.authservice.refreshaccesstoken(refreshtoken)

         return res.status(200).json({success:true,accesstoken:newaccesstoken})
      } catch (error) {
         if(error.name=='TokenExpiredError'){
          throw new UnauthorizedException('refresh token got expired')
         }
         if(error.name='JsonWebTokenError'){
          throw new UnauthorizedException('invalid refresh token')
         }
         throw new UnauthorizedException('authentication failed')
      }
         
    }


    @Post('logout')
    async logoutstudent(@Req() req:Request,@Res() res:Response){
        res.clearCookie('refreshToken',{httpOnly:true,secure:true,sameSite:'strict'})
        return res.status(200).json({message:'Logged out successfully'})
    }


    @Post('forgotpassword')
    async forgotpassword(@Body() body:{email:string}){
      if(!body.email){
        throw new BadRequestException('email is required')
      }
      return this.authservice.forgotpassword(body.email)
    }

    @Post('resetpassword/:token')
    async resetpassword(@Param('token') token:string,@Body() body:{password:string}){
      return this.authservice.resetPasswordStudent(token,body.password)
    }
   

   
}
