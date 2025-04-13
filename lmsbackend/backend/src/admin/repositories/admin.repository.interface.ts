import { CourseDocument } from "src/instructors/courses/course.schema";

export interface IAdminRepository{
    getAllCourses():Promise<{courses:CourseDocument[],total:number}>
    updateCourseStatus(courseId:string,isApproved:boolean,feedback?:string):Promise<CourseDocument|null>
    getCourseById(courseId: string): Promise<CourseDocument | null>;
}