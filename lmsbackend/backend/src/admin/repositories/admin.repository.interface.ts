import { CourseDocument } from "src/instructors/courses/course.schema";
import { Payment, PaymentDocument } from "src/payment/schema/payment.schema";

export interface IAdminRepository{
    getAllCourses():Promise<{courses:CourseDocument[],total:number}>
    updateCourseStatus(courseId:string,isApproved:boolean,feedback?:string):Promise<CourseDocument|null>
    getCourseById(courseId: string): Promise<CourseDocument | null>;

    getSalesHistory(page:number,limit:number):Promise<{sales:Payment[],total:number}>

    getOrderById(orderId:string):Promise<PaymentDocument|null>
}