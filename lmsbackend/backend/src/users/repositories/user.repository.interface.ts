import { CourseDocument } from "src/instructors/courses/course.schema";
import {user, userDocument } from "../users.schema";

export interface IUserRepository{
    findById(userId:string):Promise<userDocument|null>;
    updateProfile(userId:string,profileData:Partial<user>):Promise<userDocument>
    // updatePassword(userId:string,hashedpassword:string):Promise<void>
    getAllPublishedCourses():Promise<CourseDocument[]>
    findCourseById(courseId:string):Promise<CourseDocument>
}