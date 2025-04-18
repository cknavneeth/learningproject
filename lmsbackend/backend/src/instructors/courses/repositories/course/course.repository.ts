import { Injectable } from '@nestjs/common';
import { ICourseRepository } from '../course.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument, CourseStatus } from '../../course.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class CourseRepository implements ICourseRepository{
    constructor(@InjectModel(Course.name) private courseModel:Model<CourseDocument>){}

    async create(courseData:Partial<Course>):Promise<CourseDocument>{
        const course=new this.courseModel(courseData)
        return course.save()
    }

    async findByInstructor(instructorId:string):Promise<CourseDocument[]>{
        return this.courseModel.find({instructor:new Types.ObjectId(instructorId)}).exec()
    }

    async update(courseId:string,courseData:Partial<Course>,instructorId:string):Promise<CourseDocument|null>{
       return this.courseModel.findOneAndUpdate(
        {
            _id:new Types.ObjectId(courseId),
            instructor:new Types.ObjectId(instructorId)
        },
        {
            $set:courseData
        },
        {
            new:true,
            runValidators:true
        }
       ).exec()
    }


    async findByInstructorAndStatus(instructorId:string,status:CourseStatus|CourseStatus[]):Promise<CourseDocument[]>{
        return this.courseModel.find({instructor:new Types.ObjectId(instructorId),
            status:Array.isArray(status)?{$in:status}:status
        }).sort({updatedAt:-1}).exec()
    }

    async findById(courseId:string):Promise<CourseDocument|null>{
        return this.courseModel.findById(courseId).exec()
    }


    async findByIdAndDelete(courseId:string):Promise<CourseDocument|null>{
        return this.courseModel.findByIdAndDelete(courseId)
    }

    async findByInstructorWithPagination(instructorId:string,page:number=1,limit:number=10):Promise<{courses:CourseDocument[],total:number}>{
        const skip=(page-1)*limit

        const [courses,total]=await Promise.all([
            this.courseModel.find({instructor:new Types.ObjectId(instructorId)})
            .populate('instructor','name emailAddress isApproved')
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .exec(),
            this.courseModel.countDocuments({instructor:new Types.ObjectId(instructorId)}).exec()
        ])

        return {courses,total}
    }

}
