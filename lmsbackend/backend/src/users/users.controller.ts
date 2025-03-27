import { Controller, Get, Request, UseGuards } from '@nestjs/common';
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


}
