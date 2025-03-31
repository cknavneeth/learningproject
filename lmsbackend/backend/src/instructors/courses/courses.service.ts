import { BadRequestException, Injectable } from '@nestjs/common';
import { CourseRepository } from './repositories/course/course.repository';
import { Course, CourseStatus } from './course.schema';
import { Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CoursesService {
    constructor(private readonly courseRepository:CourseRepository,private cloudinaryService:CloudinaryService){}

    async createCourse(courseData:Partial<Course>,instructorId:string){
        return this.courseRepository.create({
            ...courseData,
            instructor:new Types.ObjectId(instructorId),
            status:CourseStatus.DRAFT
        })
    }


    async uploadVideo(file:Express.Multer.File){
        if(!file.mimetype.includes('video')){
            throw new BadRequestException('File must be a video')
        }

         try {
            const videoUrl=await this.cloudinaryService.UploadedFile(file)
            return videoUrl
         } catch (error) {
            
         }
    }


    //for uploading thumbnails
    async uploadThumbnail(file:Express.Multer.File){
        if(!file.mimetype.includes('image')){
            throw new BadRequestException('File must be an image')
        }

        try{
            const thumbnailUrl=await this.cloudinaryService.UploadedFile(file)
            return thumbnailUrl
        }catch(error){
            throw new BadRequestException('Failed to Upload thumbnail')
        }
    }


    async getCoursesByInstructor(instructorId:string){
        return this.courseRepository.findByInstructor(instructorId)
    }

    async updateCourse(courseId:string,courseData:Partial<Course>,instructorId:string){
         return this.courseRepository.update(courseId,courseData,instructorId)
    }


    async publishCourse(courseId:string,instructorId:string){
        return this.courseRepository.update(courseId,{status:CourseStatus.PUBLISHED},instructorId)
    }
}
