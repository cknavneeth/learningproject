import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch,Query,
    DefaultValuePipe,
    ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('auth/admin')
export class AdminController {
    constructor(private readonly adminservice:AdminService){}

    @Get('students')
    async fetchallstudents(){
        return this.adminservice.fetchallstudents()
    }

    @Patch('toggleblock/:studentId')
    async toggleBlockStatus(@Param('studentId') studentId:string){
        console.log('jijo shibu',studentId)
        return this.adminservice.toggleBlockStatus(studentId)
    }

    @Get('/instructors')
    async fetchallinstructors(){
        return this.adminservice.fetchallinstructors()
    }

    @Patch('blockinstructor/:instructorId')
    async toggleblockInstructor(@Param('instructorId') instructorId:string){
        return this.adminservice.blockstatus(instructorId)
    }


    @Patch('verifyinstructor/:instructorId')
    async verifyinstructor(@Param('instructorId') instructorId:string,@Body() body:{isApproved:boolean,feedback?:string}){
          return this.adminservice.verifyinstructor(instructorId,body.isApproved,body.feedback)
    }


    @Get('courses')
    async getAllCourses(
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page:number,
        @Query('limit',new DefaultValuePipe(10),ParseIntPipe) limit:number)
    {
        try {
            const courses=await this.adminservice.getAllCourses(page,limit)
            return courses
        } catch (error) {
            console.error('Controller error',error)
        }
       

    }

    @Patch('courses/:courseId/approve')
    async approveCourse(@Param('courseId') courseId:string){
        try {
            return await this.adminservice.updateCourseStatus(courseId,true)
        } catch (error) {
            if(error instanceof NotFoundException){
                throw error
            }
            throw new BadRequestException('Failed to approve course')
        }
    }



    @Patch('courses/:courseId/reject')
    async rejectCourse(@Param('courseId') courseId:string, @Body() body:{feedback:string}){
        console.log('Rejection endpoint called with:', { courseId, feedback: body.feedback });
        try {
            
        if (!body.feedback) {
            throw new BadRequestException('Feedback is required when rejecting a course');
        }
            const result= await this.adminservice.updateCourseStatus(courseId,false,body.feedback)
            return result
        } catch (error) {
            console.log('error while rejecting')
            if(error instanceof NotFoundException){
                throw error
            }
            throw new BadRequestException('Failed to reject course')
        }
    }
}
