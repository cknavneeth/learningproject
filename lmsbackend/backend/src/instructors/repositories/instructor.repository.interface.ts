import {instructor,instructorDocument} from "../instructor.schema";


export interface IDashboardStats{
    totalCourses:number;
    totalStudents:number;
    totalEarnings:number;
    monthlySalesData:{
        month:string;
        revenue:number;
        purchases:number;
    }[];
    trendingCourses:{
        _id:string;
        title:string;
        purchases:number;
        revenue:number
    }[]
}

export interface IInstructorRepository{
    findById(instructorId:string):Promise<instructorDocument|null>;
    updateProfile(instructorId:string,profileData:Partial<instructor>):Promise<instructorDocument>
    updatePassword(instructorId:string,hashedpassword:string):Promise<void>
    updateReapplyStatus(instructorId:string,canReapply:boolean):Promise<instructorDocument>

    //iam doning instructor dashboard
    getDashboardStats(instructorId:string):Promise<IDashboardStats>
}