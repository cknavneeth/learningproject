import { user } from "src/users/users.schema";
import { Course } from "src/instructors/courses/course.schema";
import { Certificate } from "src/certificate/schema/certificate.schema";
import { Types } from "mongoose";

export interface ICertificateService{

    generateCertificate(userId:Types.ObjectId,courseId:string,completionDate:Date):Promise<Certificate>

    getUserCertificates(userId:Types.ObjectId,page?:number,limit?:number):Promise<{
        certificates:Certificate[],
        pagination:{
            total:number,
            page:number,
            limit:number,
            totalPages:number
        }
    }>

    getCertificateById(certificateId:string):Promise<Certificate>

}