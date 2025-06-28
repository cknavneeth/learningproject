import { Body, Controller, Get, Inject, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { GuardGuard } from 'src/authentication/guard/guard.guard';
import { InstructorsService } from './instructors.service';

@Controller('auth/instructor')
export class InstructorsController {

    constructor(private readonly _instructorservice:InstructorsService){}
    
   @Get('profile')
   @UseGuards(GuardGuard)
   async getInstructorProfile(@Request() req){
    console.log('backendile request vannating')
      const instructorId=req.user.InstructorId
      return this._instructorservice.getProfile(instructorId)
   }

   @Put('profile')
   @UseGuards(GuardGuard)
   async updateInstructorProfile(@Request() req,@Body() profileData:{username:string,phone?:string,bio?:string}){
    const instructorId=req.user.InstructorId
    return this._instructorservice.updateProfile(instructorId,profileData)
   }

   @Put('changepassword')
   @UseGuards(GuardGuard)
   async updateInstructorPassword(@Request() req,@Body() passwordData:{currentPassword:string,newPassword:string}){
    const instructorId=req.user.InstructorId
    return this._instructorservice.resetPassword(instructorId,passwordData)
   }


   @Post('reapply')
   @UseGuards(GuardGuard)
   async reapplyAsInstructor(@Req() req:any){
      console.log('reapply request received')
      const instructorId=req.user.InstructorId
      return this._instructorservice.reapplyAsInstructor(instructorId)
   }


   //gonna do instructor dashboard ok
   @Get('dashboard-stats')
   @UseGuards(GuardGuard)
   async getDashboardStats(@Request() req){
    const instructorId=req.user.InstructorId
    return this._instructorservice.getDashboardStats(instructorId)
   }

}
