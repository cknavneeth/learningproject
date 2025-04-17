import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../user.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user, userDocument } from 'src/users/users.schema';
import { Course, CourseDocument, CourseStatus } from 'src/instructors/courses/course.schema';

export interface CourseResponse {
    courses: CourseDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

@Injectable()
export class UserRepository implements IUserRepository{
     constructor(@InjectModel(user.name) private usermodel:Model<userDocument>,@InjectModel(Course.name) private courseModel: Model<CourseDocument>,){}

     async findById(userId:string):Promise<userDocument|null>{
         return  await this.usermodel.findById(userId).exec()
     }

    //gonna do update profile
    async updateProfile(userId:string,profileData:Partial<user>):Promise<userDocument>{
        const user=await this.usermodel.findByIdAndUpdate(userId,{$set:profileData},{new:true}).exec()
        if(!user){
            throw new Error('User not found')
        }
        return user
    }


    async getAllPublishedCourses(filters:{
        minPrice?: number,
        maxPrice?: number,
        languages?: string[],
        levels?: string[],
        page?: number,
        limit?: number
    }):Promise<CourseResponse>{
 

        const query:any={
            status:CourseStatus.PUBLISHED
        }

        
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            query.price = {};
            if (filters.minPrice !== undefined) {
                query.price.$gte = filters.minPrice;
            }
            if (filters.maxPrice !== undefined) {
                query.price.$lte = filters.maxPrice;
            }
        }



        if (filters.languages && filters.languages.length > 0) {
            query.courseLanguage = { $in: filters.languages };
        }


        if (filters.levels && filters.levels.length > 0) {
            query.level = { $in: filters.levels };
        }


        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;

        // const allCourses=await this.courseModel.find({
        //     status:CourseStatus.PUBLISHED
        // })
        // .populate('instructor', 'name profileImage')
        // .select('title description thumbnailUrl price duration level category instructor')
        // .exec();

        // return allCourses
        const [courses, total] = await Promise.all([
            this.courseModel.find(query)
                .populate('instructor', 'name profileImage')
                .populate('category','name')
                .select('title description thumbnailUrl price duration level category instructor courseLanguage')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.courseModel.countDocuments(query)
        ]);

        
        return {
            courses,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }


    async findCourseById(courseId:string):Promise<CourseDocument>{
        const course=await this.courseModel.findById(courseId).exec()
        if(!course){
            throw new Error('Course not found')
        }
        return course
    }
     
}
