export interface TopInstructor{
    _id:string;
    name:string;
    email:string;
    totalSales:number;
    totalRevenue:number;
    totalStudents:number;
}


export interface TopSellingCourse{
    _id:string;
    title:string;
    instructor:{
        name:string;
        email:string;
    }
    totalSales:number;
    revenue:number;
}