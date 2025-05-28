import { BadRequestException, Body, Controller, DefaultValuePipe, Get, Logger, Param, ParseIntPipe, Put, Query, Req, Request, UseGuards } from '@nestjs/common';
import { GuardGuard } from 'src/authentication/guard/guard.guard';
import { UsersService } from './users.service';
import { Roles } from 'src/decorators/roles.decarotor';
import { Role } from 'src/common/enums/role.enum';
// import { Request } from 'express';

@Controller('auth/student')
export class UsersController {

    private readonly logger=new Logger(UsersController.name)

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

        @Query('categories') categories?: string,

        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number
   ){
    try {
        console.log('Received filter params:', {
            minPrice, maxPrice, languages,categories, page, limit
          });
    
          const filters = {
            minPrice,
            maxPrice,
            languages: languages ? languages.split(',') : undefined,
            categories: categories ? categories.split(',') : undefined,
            page,
            limit
          };

          this.logger.log('filteing all courses',filters)
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


   @Get('wallet')
   @Roles(Role.STUDENT)
   @UseGuards(GuardGuard)
   async getWalletBalance(@Req() req):Promise<{wallet:number}>{
    const userId=req.user.userId
    return this.usersService.getWalletBalance(userId)
   }


   @Get('transactions')
   @UseGuards(GuardGuard)
   async getTransactions(@Request() req){
    const userId=req.user.userId
    return this.usersService.getRecentTransactions(userId)
   }

   //this user controller is enough right
}
