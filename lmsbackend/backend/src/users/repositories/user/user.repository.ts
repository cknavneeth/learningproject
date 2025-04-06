import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../user.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user, userDocument } from 'src/users/users.schema';
import { Course, CourseDocument, CourseStatus } from 'src/instructors/courses/course.schema';

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


    async getAllPublishedCourses():Promise<CourseDocument[]>{
        const allCourses=await this.courseModel.find({
            status:CourseStatus.PUBLISHED
        })
        .populate('instructor', 'name profileImage')
        .select('title description thumbnailUrl price duration level category instructor')
        .exec();

        return allCourses
    }
     
}
