import { Course, CourseDocument, CourseStatus } from "../course.schema";

export interface ICourseRepository{
    create(courseData:Partial<Course>):Promise<CourseDocument>
    findByInstructor(instructorId:string):Promise<CourseDocument[]>
    update(courseId:string,courseData:Partial<Course>,instructorId:string):Promise<CourseDocument|null>
    findByInstructorAndStatus(courseId:string,status:CourseStatus):Promise<CourseDocument[]>
    findById(courseId:string):Promise<CourseDocument|null>
    findByIdAndDelete(courseId:string):Promise<CourseDocument|null>
}