import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { GuardGuard } from 'src/authentication/guard/guard.guard';
import { UsersService } from './users.service';
// import { Request } from 'express';

@Controller('auth/student')
export class UsersController {

    constructor(private readonly usersService:UsersService){}


    @Get('profile')
    @UseGuards(GuardGuard)
    async getStudentProfile(@Request() req){
   
         const userId=req.user.userId
         return this.usersService.getProfile(userId)
    }



    @Put('profile')
    @UseGuards(GuardGuard)
    async updateStudentProfile(@Request() req,@Body() profileData:{username:string,phone:string,bio:string}){
        const userId=req.user.userId
        return this.usersService.updateProfile(userId,profileData)
    }

    @Put('changepassword')
    @UseGuards(GuardGuard)
   async updateStudentPassword(@Request() req,@Body() passwordData:{currentPassword:string,newPassword:string}){
       const userId=req.user.userId
       return this.usersService.updateStudentPassword(userId,passwordData)
   }


}
