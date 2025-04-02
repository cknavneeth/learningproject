import { BadRequestException, Body, Controller, Get, Param, Post,Put,Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
    async createCourse(@Body() courseData:Partial<Course>,@Request() req){
        const instructorId=req.user.InstructorId
        return this.coursesService.createCourse(courseData,instructorId)
    }


    @Post('upload-video')
    @UseInterceptors(FileInterceptor('video',{
        storage: memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.includes('video')) {
                return cb(new BadRequestException('Only video files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 1024 * 1024 * 100 // 100 MB
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

    @Get()
    @UseGuards(GuardGuard)
    async getInstructorCourses(@Request() req){
        const instructorId=req.user.InstructorId
        return this.coursesService.getCoursesByInstructor(instructorId)
    }

    @Put(':courseId')
    @UseGuards(GuardGuard)
    async updateCourse(@Param('courseId') courseId:string,@Body() courseData:Partial<Course>,@Request() req){
        const instructorId=req.user.InstructorId
        return this.coursesService.updateCourse(courseId,courseData,instructorId)
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
}
