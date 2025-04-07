import { CourseDocument } from "src/instructors/courses/course.schema";
import {user, userDocument } from "../users.schema";
import { CourseResponse } from "./user/user.repository";

export interface IUserRepository{
    findById(userId:string):Promise<userDocument|null>;
    updateProfile(userId:string,profileData:Partial<user>):Promise<userDocument>
    // updatePassword(userId:string,hashedpassword:string):Promise<void>
    getAllPublishedCourses(filters:{
        minPrice?: number,
        maxPrice?: number,
        languages?: string[],
        levels?: string[],
        page?: number,
        limit?: number
    }):Promise<CourseResponse>
    findCourseById(courseId:string):Promise<CourseDocument>
}