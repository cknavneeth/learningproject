import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument, CourseStatus } from 'src/instructors/courses/course.schema';
import { IAdminRepository } from '../admin.repository.interface';

@Injectable()
export class AdminRepository implements IAdminRepository{

    constructor(@InjectModel(Course.name) private courseModel:Model<CourseDocument> ){}

    async getAllCourses(page:number=1,limit:number=10):Promise<{courses:CourseDocument[],total:number}> {
        const skip=(page-1)*limit

        const [courses,total]=await Promise.all([
            this.courseModel.find()
            .populate('instructor','name email isApproved')
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .exec(),
            this.courseModel.countDocuments().exec()
        ])
        return { courses, total };
    }

    async updateCourseStatus(courseId:string,isApproved:boolean,feedback?:string):Promise<CourseDocument|null>{
        if(!Types.ObjectId.isValid(courseId)){
            throw new NotFoundException('invalid course id')
        }

        const course=await this.courseModel.findById(courseId)
        if(!course){
            throw new NotFoundException('course not found')
        }
        if(course.status!==CourseStatus.PENDING_REVIEW){
            throw new NotFoundException('course is not pending review')
        }

        const updates:any={
            status:isApproved?CourseStatus.PUBLISHED:CourseStatus.REJECTED,
            feedback:feedback,
            updatedAt:new Date()
        }

        if(!isApproved&&feedback){
            updates.rejectionFeedback=feedback
            updates.rejectedAt=new Date()
        }

        const updateCourse=await this.courseModel.findByIdAndUpdate(courseId,{$set:updates},{new:true}).populate('instructor').exec()

        if(!updateCourse){
            throw new NotFoundException('Failed to update course')
        }
        return updateCourse
    }
}
