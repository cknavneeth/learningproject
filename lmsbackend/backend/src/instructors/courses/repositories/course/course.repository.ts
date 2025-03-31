import { Injectable } from '@nestjs/common';
import { ICourseRepository } from '../course.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from '../../course.schema';
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
        return this.courseModel.findByIdAndUpdate(courseId,{$set:courseData},{new:true}).exec()
    }



}
