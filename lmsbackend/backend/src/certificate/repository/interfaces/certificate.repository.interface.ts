import { Types } from "mongoose";
import { Certificate, CertificateDocument } from "src/certificate/schema/certificate.schema";

export interface ICertificateRepository{
    create(certificateData:Partial<Certificate>):Promise<CertificateDocument>

    findByUserAndCourse(userId:Types.ObjectId,courseId:Types.ObjectId):Promise<CertificateDocument|null>

    findByUser(userId:Types.ObjectId,page:number,limit:number):Promise<{
        certificates:CertificateDocument[],
        total:number,
        page:number,
        limit:number,
        totalPages:number
    }>


    findById(certificateId:string):Promise<CertificateDocument|null>
}