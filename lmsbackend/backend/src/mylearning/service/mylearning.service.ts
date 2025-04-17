
import { ERROR_MESSAGES, MYLEARNING_REPOSITORY } from '../constants/mylearning.constants';
import { IMyLearningRepository } from '../repository/interfaces/mylearning.repository.interface';
import { CourseProgress } from '../schema/course-progress.schema';
import { IMyLearningService } from './interfaces/mylearning.service.interface';
import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class MylearningService implements IMyLearningService{
    constructor(@Inject(MYLEARNING_REPOSITORY) private readonly mylearningRepository:IMyLearningRepository){}

    async getEnrolledCourses(userId:string,page:number,limit:number){
        console.log('service ethi ,ini kitto')
        const skip=(page-1)*limit

        const {courses,total}=await this.mylearningRepository.findEnrolledCourses(userId,skip,limit)

        return {
            courses,
            pagination:{
                total,
                page,
                limit,
                totalPages:Math.ceil(total/limit)
            }
        }
    }


    async getCourseDetails(userId:string,courseId:string){
        const isEnrolled=await this.mylearningRepository.isEnrolled(userId,courseId)

        if(!isEnrolled){
            console.log('why this happnes',isEnrolled)
            throw new UnauthorizedException('You are not enrolled in this course')
        }

        const course=await this.mylearningRepository.findCourseById(courseId)

        if(!course){
            throw new NotFoundException('Course not found')
        }

        const progress=await this.getProgress(userId,courseId)

        return {
            ...course,
            progress:progress.overallProgress,
            sectionProgress:progress.sectionProgress,
            videoTimestamps:progress.videoTimestamps
        }
    }


    async getProgress(userId:string,courseId:string):Promise<CourseProgress>{
        let progress=await this.mylearningRepository.findProgress(userId,courseId)
        if(!progress){
            progress=await this.mylearningRepository.createProgress(userId,courseId)
        }
        return progress
    }


    async updateProgress(userId:string,courseId:string,sectionId:string,progress:number):Promise<CourseProgress>{
         const isEnrolled=await this.mylearningRepository.isEnrolled(userId,courseId)
         if(!isEnrolled){
            throw new UnauthorizedException('ERROR_MESSAGES.NOT_ENROLLED')
         }
         return this.mylearningRepository.updateProgress(userId,courseId,{
            sectionId,
            progress
         })
    }

    

    async downloadResource(userId: string, courseId: string, resourceId: string): Promise<{fileUrl: string, fileName: string, contentType: string}> {
        const isEnrolled = await this.mylearningRepository.isEnrolled(userId, courseId);
        if (!isEnrolled) {
            console.log('why this happnes while download ', isEnrolled);
            throw new UnauthorizedException('ERROR_MESSAGES.NOT_ENROLLED');
        }

        const course = await this.mylearningRepository.findCourseById(courseId);
        if (!course) {
            throw new NotFoundException(ERROR_MESSAGES.COURSE_NOT_FOUND);
        }

        for (const section of course.sections) {
            const resource = section.resources.find(r => r._id.toString() === resourceId);
            if (resource) {
                // Determine content type based on file extension
                const fileExtension = resource.fileUrl.split('.').pop()?.toLowerCase();
                let contentType = 'application/octet-stream'; // default

                switch (fileExtension) {
                    case 'pdf':
                        contentType = 'application/pdf';
                        break;
                    case 'doc':
                        contentType = 'application/msword';
                        break;
                    case 'docx':
                        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                        break;
                    // Add more cases as needed
                }

                return {
                    fileUrl: resource.fileUrl,
                    fileName: resource.title,
                    contentType: contentType
                };
            }
        }
        throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }


    async getCourseProgress(userId:string,courseId:string):Promise<CourseProgress>{
        const isEnrolled=await this.mylearningRepository.isEnrolled(userId,courseId)

        if(!isEnrolled){
            throw new UnauthorizedException('ERROR_MESSAGES.NOT_ENROLLED');       
         }
         let progress = await this.mylearningRepository.getCourseProgress(userId, courseId);
         if (!progress) {
             progress = await this.mylearningRepository.createProgress(userId, courseId);
         }
         return progress;
    }



}
