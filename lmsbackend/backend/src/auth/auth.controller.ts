import { BadRequestException, Body, Controller, Post, Req, Res, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import {Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Certificate } from 'crypto';
import * as multer from 'multer';

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


    @Post('refreshtoken')
    async refreshtoken(@Req() req:Request,@Res() res:Response){

      try {
        const refreshtoken=req.cookies.refreshtoken
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



    @Post('instructorRegister')
    @UseInterceptors(FileInterceptor('certificate'))
    async registerinstructor(
      @Body() body:any,
      @UploadedFile() certificate:Express.Multer.File
    ){
      console.log('file received',certificate)
      console.log('body',body)
        return this.authservice.registerinstructor(body.name,body.emailaddress,body.password,certificate) 
    }

    @Post('insotp')
    async sendOtp(@Body() body:{emailaddress:string}){
         console.log('email for sending otp',body.emailaddress)
         return this.authservice.sendinstructorotp(body.emailaddress)
    }

    @Post('verifyinsotp')
    async verifyOtp(@Body() body:{emailaddress:string,otp:string}){
        return this.authservice.verifyinstructorotp(body.emailaddress,body.otp)
    }



    @Post('inslogin')
    async instructorLogin(@Body() body:{emailaddress:string,password:string},@Res() res:Response){
      console.log('login call ethiyonn nokam')
      return this.authservice.instructorLogin(body.emailaddress,body.password,res)
    }

    @Post('getinsAccess')
    async refreshaccesstoken(@Req() req:Request,@Res() res:Response){
         try {
            let refreshtoken=req.cookies.instructor_refreshToken
            if(!refreshtoken){
              return res.status(401).json({success:false,message:'refresh token is not available'})
            }

            const newaccesstoken=this.authservice.accesstokenretry(refreshtoken)
         } catch (error) {
          
         }
    }
}
