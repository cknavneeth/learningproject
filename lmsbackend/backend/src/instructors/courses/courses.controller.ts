import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Post,Put,Query,Req,Request, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './course.schema';
import { GuardGuard } from 'src/authentication/guard/guard.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { memoryStorage } from 'multer';

@Controller('auth/instructor/courses')
export class CoursesController {

    constructor(private readonly coursesService:CoursesService){}

    @Post()
    @UseGuards(GuardGuard)
    async createCourse(@Body() courseData:{isDraft:boolean}&Partial<Course>,@Request() req){
        const instructorId=req.user.InstructorId
        return this.coursesService.createCourse(courseData,instructorId)
    }


    @Post('upload-video')
    @UseInterceptors(FileInterceptor('video',{
        storage: memoryStorage(),
        limits: {
            fileSize: 104857600 // 100MB
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.includes('video')) {
                return cb(new BadRequestException('Only video files are allowed!'), false);
            }
            
            // Additional video format validation if needed
            const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return cb(new BadRequestException('Invalid video format. Supported formats: MP4, WebM, OGG'), false);
            }
            
            cb(null, true);
        }
    }))
    async uploadVideo(@UploadedFile() file:Express.Multer.File){
        console.log('file received',file)
        const videoUrl=await this.coursesService.uploadVideo(file)
        return {videoUrl}
    }


    @Post('upload-thumbnail')
    @UseGuards(GuardGuard)
    @UseInterceptors(FileInterceptor('thumbnail'))
    async uploadThumbnail(@UploadedFile() file:Express.Multer.File){
        console.log('file received',file)
        const thumbnailUrl=await this.coursesService.uploadThumbnail(file)
        return {thumbnailUrl}
    }

    // @Get()
    // @UseGuards(GuardGuard)
    // async getInstructorCourses(@Request() req){
    //     const instructorId=req.user.InstructorId
    //     return this.coursesService.getCoursesByInstructor(instructorId)
    // }

    @Put(':courseId')
    @UseGuards(GuardGuard)
    async updateCourse(@Param('courseId') courseId:string,@Body() courseData:Partial<Course>,@Request() req){
        console.log('Updating course:', { courseId, courseData }); 
        const instructorId=req.user.InstructorId
        try {
            const updatedCourse=await this.coursesService.updateCourse(courseId,courseData,instructorId)
            if(!updatedCourse){
                throw new NotFoundException('Course not found')
            }
            return updatedCourse
        } catch (error) {
            console.error('error updating course',error)
            throw error
        }
        // return this.coursesService.updateCourse(courseId,courseData,instructorId)
    }


    @Put(':courseId/publish')
    @UseGuards(GuardGuard)
    async publishCourse(@Param('courseId') courseId:string,@Request() req){
        const instructorId=req.user.InstructorId
        return this.coursesService.publishCourse(courseId,instructorId)
    }


    @Post('upload-resource')
    @UseGuards(GuardGuard)
    @UseInterceptors(FileInterceptor('resource',{
        storage: memoryStorage(),
        limits: {
            fileSize: 1024 * 1024 * 25 // 25MB
        }
    }))
    async uploadResource(@UploadedFile() file:Express.Multer.File){
        console.log('resource file received',file)
        const fileUrl=await this.coursesService.uploadResource(file)
        return {fileUrl}
    }


    //controllers related to drafts
    @Get('drafts')
    @UseGuards(GuardGuard)
    async getDrafts(@Request() req){
        try {
            const instructorId=req.user.InstructorId
            const drafts=await this.coursesService.getDrafts(instructorId)
            return drafts
        } catch (error) {
            throw new BadRequestException('failed to fetch drafts')
        }
    }



    @Delete('draft/:id')
    @UseGuards(GuardGuard)
    async deleteDraft(@Param('id') draftId:string,@Request() req){
        try {
            const instructorId=req.user.InstructorId
            const result=await this.coursesService.deleteDraft(draftId,instructorId)
            if(!result){
               throw new NotFoundException('Draft not found')
            }
            return {message:'Draft deleted successfully'}
        } catch (error) {
            if(error instanceof NotFoundException){
                throw error
            }
            throw new BadRequestException('Failed to delete draft')
        }
    }


    ///get student who purchased instructors course
    @Get('enrolled-students')
    @UseGuards(GuardGuard)
    async getEnrolledStudents(@Request() req,
    @Query('searchTerm') searchTerm:string,
    @Query('page',new DefaultValuePipe(1),ParseIntPipe) page:number,
    @Query('limit',new DefaultValuePipe(10),ParseIntPipe) limit:number)
   {

    try {
         const instructorId=req.user.InstructorId

         const result=await this.coursesService.getEnrolledStudents(instructorId,page,limit,searchTerm)
         return result
    } catch (error) {
        throw new BadRequestException('Failed to fetch enrolled students')
    }

   }
    


    @Get(':id')
    @UseGuards(GuardGuard)
    async getCourseById(@Param('id') id:string,@Request() req){
         const instructorId=req.user.InstructorId
         return this.coursesService.getCourseById(id,instructorId)
    }


    @Get()
    @UseGuards(GuardGuard)
    async getMyCourses(@Request() req,
    @Query('searchTerm') searchTerm:string,
    @Query('page',new DefaultValuePipe(1),ParseIntPipe) page:number,
    @Query('limit',new DefaultValuePipe(10),ParseIntPipe) limit:number
    ){
        try {
            const instructorId=req.user.InstructorId
            const result=await this.coursesService.getCoursesForInstructor(instructorId,page,limit,searchTerm)
            return result
        } catch (error) {
            throw new BadRequestException('Failed to fetch courses')
        }
    }


    //get course detail page
    @Get('details/:id')
    @UseGuards(GuardGuard)
    async getCourseDetailsForInstructor(@Param('id') id:string,@Req() req){
        try {
            const instructorId=req.user.InstructorId
            return this.coursesService.getCourseDetailsForInstructor(id,instructorId)
        } catch (error) {
            if(error instanceof NotFoundException){
                throw error
            }
            if(error instanceof UnauthorizedException){
                throw error
            }
            throw new BadRequestException('Failed to fetch course Details')
        }
    }
   




}
