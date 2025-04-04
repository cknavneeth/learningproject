import { CourseDocument } from "src/instructors/courses/course.schema";

export interface IAdminRepository{
    getAllCourses():Promise<CourseDocument[]>
    updateCourseStatus(courseId:string,isApproved:boolean,feedback?:string):Promise<CourseDocument|null>
}