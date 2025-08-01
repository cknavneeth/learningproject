import { Types } from "mongoose";
import { TopInstructor, TopSellingCourse } from "src/common/interfaces/dashboard.interface";
import { CourseDocument } from "src/instructors/courses/course.schema";
import { Payment, PaymentDocument } from "src/payment/schema/payment.schema";

export interface AggregatedSale {
    _id: Types.ObjectId;
    orderId: string;
    status: string;
    amount: number;
    createdAt:Date
    purchaseDate: Date;
    coursesDetails: {
        courseId: Types.ObjectId;
        amount: number;
        status: string;
        cancellationReason?: string;
        cancellationDate?: Date;
        cancellationStatus?: string;
    }[];
    student: {
        username: string;
        email: string;
    };
}

export interface IAdminRepository{
    getAllCourses():Promise<{courses:CourseDocument[],total:number}>
    updateCourseStatus(courseId:string,isApproved:boolean,feedback?:string):Promise<CourseDocument|null>
    getCourseById(courseId: string): Promise<CourseDocument | null>;

    getSalesHistory(page:number,limit:number):Promise<{sales:AggregatedSale[],total:number}>

    getOrderById(orderId:string):Promise<PaymentDocument|null>

    //for admin dashboard
    getDashboardStats():Promise<{
        totalStudents:number;
        totalInstructors:number;
        totalCourses:number;
        totalRevenue:number;
        totalPurchases:number;
        monthlySalesData:{
            month:string;
            revenue:number;
            purchases:number;
        }[],
        topSellingCourses:TopSellingCourse[],
        topInstructors:TopInstructor[]

    }>
}
