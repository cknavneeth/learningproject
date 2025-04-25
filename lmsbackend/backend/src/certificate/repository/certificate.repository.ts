import { Injectable } from '@nestjs/common';
import { ICertificateRepository } from './interfaces/certificate.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Certificate, CertificateDocument } from '../schema/certificate.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class CertificateRepository implements ICertificateRepository{

    constructor(@InjectModel(Certificate.name) private certificateModel:Model<CertificateDocument>){}

    async create(certificateData:Partial<Certificate>):Promise<CertificateDocument>{
        const certificate=new this.certificateModel(certificateData)
        return certificate.save()
    }



    async findByUserAndCourse(userId:Types.ObjectId,courseId:Types.ObjectId):Promise<CertificateDocument|null>{
        return this.certificateModel.findOne({userId,courseId})
    }


   async findByUser(
    userId:Types.ObjectId,
    page:number=1,
    limit:number=10
   ):Promise<{
    certificates:CertificateDocument[],
    total:number,
    page:number,
    limit:number,
    totalPages:number
   }>{

    const skip=(page-1)*limit

    const [certificates,total]=await Promise.all([
        this.certificateModel.find({userId})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .exec(),
        this.certificateModel.countDocuments({userId}).exec()
    ])

    return {
        certificates,
        total,
        page,
        limit,
        totalPages:Math.ceil(total/limit)
    }
       
   }


   async findById(id:string):Promise<CertificateDocument|null>{
    return this.certificateModel.findById(id)
   }

}
