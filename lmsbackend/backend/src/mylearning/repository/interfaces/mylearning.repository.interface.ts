import { CourseDocument } from "src/instructors/courses/course.schema"
import { UpdateProgressDto } from "src/mylearning/dto/update-progress.dto"
import { CourseProgress } from "src/mylearning/schema/course-progress.schema"

export interface IMyLearningRepository{
    findEnrolledCourses(userId:string,skip:number,limit:number):Promise<{
        courses:any[],
        total:number
    }>

    findCourseById(courseId:string):Promise<any>

    findProgress(userId:string,courseId:string):Promise<CourseProgress|null>

    createProgress(userId:string,courseId:string):Promise<CourseProgress>

    updateProgress(userId:string,courseId:string,updateData:UpdateProgressDto):Promise<CourseProgress>

    isEnrolled(userId:string,courseId:string):Promise<boolean>

    getCourseProgress(userId:string,courseId:string):Promise<CourseProgress|null>
}