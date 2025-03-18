import { Controller, Param } from '@nestjs/common';
import { InstructorauthService } from './instructorauth.service';
import { BadRequestException, Body, Get, Post, Req, Res, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import {Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('auth/instructor')
export class InstructorauthController {

    constructor(private readonly authservice:InstructorauthService,private readonly cloudinary:CloudinaryService){}

    

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


    //gonna do forgot password
    @Post('forgotpasswordinstructor')
    async forgotpassword(@Body() body:{emailaddress:string}){
      if(!body.emailaddress){
        throw new BadRequestException('email is required')
      }
      return this.authservice.forgotpassInstructor(body.emailaddress)
    }

    //resetting password for instructor
    @Post('resetpasswordinstructor/:token')
    async resetpassword(@Param('token') token:string,@Body() body:{password:string}){
      return this.authservice.resetPasswordInstructor(token,body.password)
    }

    @Post('logout')
    async logoutinstructor(@Req() req:Request,@Res() res:Response){
      res.clearCookie('instructor_refreshToken',{httpOnly:true,secure:true,sameSite:'strict'})
      return res.status(200).json({message:'Logged out successfully'})
    } 

    
}
