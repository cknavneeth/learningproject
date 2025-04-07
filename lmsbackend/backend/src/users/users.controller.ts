import { BadRequestException, Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Put, Query, Request, UseGuards } from '@nestjs/common';
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


   @Get('courses')
   async getAllCourses(
    @Query('minPrice',new DefaultValuePipe(0),ParseIntPipe) minPrice?:number,
    @Query('maxPrice', new DefaultValuePipe(1000000), ParseIntPipe) maxPrice?: number,
        @Query('languages') languages?: string,
        @Query('levels') levels?: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number
   ){
    try {
        console.log('Received filter params:', {
            minPrice, maxPrice, languages, levels, page, limit
          });
    
          const filters = {
            minPrice,
            maxPrice,
            languages: languages ? languages.split(',') : undefined,
            levels: levels ? levels.split(',') : undefined,
            page,
            limit
          };
        console.log('getting all courses')
        const courses= await this.usersService.getAllPublishedCourses(filters)
        console.log('courses fetch aay',courses)
        return courses
    } catch (error) {
        throw new BadRequestException('Failed to fetch courses')
    }
   }

   @Get('courses/:id')
   @UseGuards(GuardGuard)
   async getCourseById(@Param('id') courseId:string){
    return this.usersService.getCourseById(courseId)
   }

}
