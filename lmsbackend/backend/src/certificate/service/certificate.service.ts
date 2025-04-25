import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICertificateService } from './interfaces/certificate.service.interface';
import { CERTIFICATE_REPOSITORY } from '../constants/constant';
import { ICertificateRepository } from '../repository/interfaces/certificate.repository.interface';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { CourseRepository } from 'src/instructors/courses/repositories/course/course.repository';
import { UserRepository } from 'src/users/repositories/user/user.repository';
import PDFDocument from 'pdfkit';
import * as path from 'path';
import { Certificate } from '../schema/certificate.schema';
import { Types } from 'mongoose';
import { Readable } from 'stream';

@Injectable()
export class CertificateService implements ICertificateService{


    constructor(
        @Inject(CERTIFICATE_REPOSITORY) private readonly certificateRepository:ICertificateRepository,
        private readonly cloudinaryService:CloudinaryService,
        private readonly courseRepository:CourseRepository,
        private readonly userRepository:UserRepository
    ){}


    private async generatePDF(userName:string,courseTitle:string,completionDate:Date):Promise<Buffer>{
        return new Promise((resolve,reject)=>{
            const doc=new PDFDocument({
                layout:'landscape',
                size:'A4'
            })


            const chunks: Buffer[] = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            
            doc.fontSize(25).text('Certificate of Completion', { align: 'center' });
            doc.moveDown();
            doc.fontSize(15).text(`This is to certify that ${userName}`, { align: 'center' });
            doc.moveDown();
            doc.text(`has successfully completed the course`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(20).text(`"${courseTitle}"`, { align: 'center' });
            doc.moveDown();
            // doc.fontSize(15).text(`Instructor: ${instructorName}`, { align: 'center' });
            doc.moveDown();
            doc.text(`Completion Date: ${completionDate.toLocaleDateString()}`, { align: 'center' });

            doc.end()
        })
    }

    private bufferToStream(buffer: Buffer): Readable {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }


    async generateCertificate(userId:Types.ObjectId,courseId:string,completionDate:Date):Promise<Certificate>{


        const courseObjectId=new Types.ObjectId(courseId)
        
        //check if certificate already exists
        const existingCertificate=await this.certificateRepository.findByUserAndCourse(userId,courseObjectId)

        if(existingCertificate){
            return existingCertificate
        }

        //fetching course and user details for showingg in certificate
        const course=await this.courseRepository.findById(courseId)
        if(!course){
            throw new Error('Course not found')
        }

        const user=await this.userRepository.findById(userId.toString())

        if(!user){
            throw new NotFoundException('User not found')
        }


        //we can generate pdf now
        const pdfBuffer=await this.generatePDF(user.username,course.title,completionDate)

        const filename = `certificate-${userId}-${courseId}.pdf`;
        const tmpPath = path.join(process.cwd(), 'tmp', filename);

        // Create file object for Cloudinary
        const file: Express.Multer.File = {
            buffer: pdfBuffer,
            fieldname: 'certificate',
            originalname: filename,
            encoding: '7bit',
            mimetype: 'application/pdf',
            size: pdfBuffer.length,
            stream: this.bufferToStream(pdfBuffer),
            destination: path.dirname(tmpPath),
            filename: filename,
            path: tmpPath
        };


        const certificateUrl=await this.cloudinaryService.UploadedFile(file)

        return this.certificateRepository.create({
            userId,
            courseId:courseObjectId,
            courseName:course.title,
            completionDate,
            certificateUrl,
        })

    }



    async getUserCertificates(userId:Types.ObjectId,page:number=1,limit:number=10):Promise<{
        certificates:Certificate[],
        pagination:{
            total:number,
            page:number,
            limit:number,
            totalPages:number
        }
    }>{

        const  result=await this.certificateRepository.findByUser(userId,page,limit)

        return {
            certificates:result.certificates,
            pagination:{
                total:result.total,
                page:result.page,
                limit:result.limit,
                totalPages:result.totalPages
            }
        }
    }



    async getCertificateById(id:string):Promise<Certificate>{
        const certificate=await this.certificateRepository.findById(id)

        if(!certificate){
            throw new NotFoundException('Certificate not found')
        }

        return certificate
    }


}
