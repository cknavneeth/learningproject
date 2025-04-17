import { CourseProgress } from "src/mylearning/schema/course-progress.schema"

export interface IMyLearningService{
    getEnrolledCourses(userId:string,page:number,limit:number):Promise<{
        courses:any[],
        pagination:{
            total:number,
            page:number,
            limit:number,
            totalPages:number
        }
    }>

    getCourseDetails(userId:string,courseId:string):Promise<any>

    updateProgress(userId:string,courseId:string,sectionId:string,progress:number):Promise<CourseProgress>

    downloadResource(userId:string,courseId:string,resourceId:string):Promise<{
        contentType: string
        fileUrl:string,
        fileName:string
    }>

    getCourseProgress(userId:string,courseId:string):Promise<CourseProgress>
}