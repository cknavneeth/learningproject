import { Course, CourseDocument } from "../course.schema";

export interface ICourseRepository{
    create(courseData:Partial<Course>):Promise<CourseDocument>
    findByInstructor(instructorId:string):Promise<CourseDocument[]>
    update(courseId:string,courseData:Partial<Course>,instructorId:string):Promise<CourseDocument|null>
}