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
import { InstructorRepository } from 'src/instructors/repositories/instructor/instructor.repository';

@Injectable()
export class CertificateService implements ICertificateService{


    constructor(
        @Inject(CERTIFICATE_REPOSITORY) private readonly _certificateRepository:ICertificateRepository,
        private readonly _cloudinaryService:CloudinaryService,
        private readonly _courseRepository:CourseRepository,
        private readonly _userRepository:UserRepository,
        private readonly _instructorRepository:InstructorRepository
    ){}


    private async generatePDF(userName: string, courseTitle: string, completionDate: Date, instructorName: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
                margin: 0
            });
    
            // Color palette
            const colors = {
                primary: '#1a365d',    // Deep Blue
                secondary: '#4299e1',  // Bright Blue
                accent: '#805ad5',     // Purple
                gold: '#d69e2e',       // Gold
                text: '#2d3748',       // Dark Gray
                background: '#f7fafc'  // Light Gray
            };
    
            const chunks: Buffer[] = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
    
            // Background with gradient
            const gradient = doc.linearGradient(0, 0, doc.page.width, doc.page.height);
            gradient.stop(0, colors.background).stop(1, '#ffffff');
            doc.rect(0, 0, doc.page.width, doc.page.height).fill(gradient);
    
            // Fancy border with double lines
            const borderWidth = 30;
            // Outer border
            doc.rect(borderWidth, borderWidth, doc.page.width - (borderWidth * 2), doc.page.height - (borderWidth * 2))
               .lineWidth(3)
               .stroke(colors.primary);
            // Inner border
            doc.rect(borderWidth + 10, borderWidth + 10, doc.page.width - ((borderWidth + 10) * 2), doc.page.height - ((borderWidth + 10) * 2))
               .lineWidth(1)
               .stroke(colors.secondary);
    
            // Certificate Header
            doc.font('Helvetica-Bold')
               .fontSize(48)
               .fillColor(colors.primary);
    
            // ScholarSync Logo/Text
            doc.text('ScholarSync', 0, 60, {
                align: 'center',
                width: doc.page.width
            });
    
            // Certificate Title with decorative underline
            doc.fontSize(36)
               .fillColor(colors.accent)
               .text('Certificate of Completion', 0, 120, {
                   align: 'center',
                   width: doc.page.width
               });
    
            // Decorative line under title
            const lineY = 170;
            doc.moveTo(doc.page.width * 0.3, lineY)
               .lineTo(doc.page.width * 0.7, lineY)
               .lineWidth(2)
               .stroke(colors.gold);
    
            // Main Content Section
            const contentStartY = 200;
            
            // "This is to certify that" text
            doc.font('Helvetica')
               .fontSize(18)
               .fillColor(colors.text)
               .text('This is to certify that', {
                   align: 'center',
                   width: doc.page.width
               });
    
            // Student Name
            doc.font('Helvetica-Bold')
               .fontSize(32)
               .fillColor(colors.primary)
               .text(userName, {
                   align: 'center',
                   width: doc.page.width
               })
               .moveDown(0.5);
    
            // Course completion text
            doc.font('Helvetica')
               .fontSize(18)
               .fillColor(colors.text)
               .text('has successfully completed the course', {
                   align: 'center',
                   width: doc.page.width
               })
               .moveDown(0.3);
    
            // Course Title
            doc.font('Helvetica-Bold')
               .fontSize(28)
               .fillColor(colors.accent)
               .text(`"${courseTitle}"`, {
                   align: 'center',
                   width: doc.page.width
               })
               .moveDown(1);
    
            // Completion Date with fancy formatting
            const formattedDate = completionDate.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            doc.fontSize(16)
               .font('Helvetica')
               .fillColor(colors.text)
               .text(`Awarded on ${formattedDate}`, {
                   align: 'center',
                   width: doc.page.width
               });
    
            // Add decorative corners with gradient
            const cornerSize = 50;
            const corners = [
                { x: borderWidth + 15, y: borderWidth + 15 },
                { x: doc.page.width - (borderWidth + 15 + cornerSize), y: borderWidth + 15 },
                { x: borderWidth + 15, y: doc.page.height - (borderWidth + 15 + cornerSize) },
                { x: doc.page.width - (borderWidth + 15 + cornerSize), y: doc.page.height - (borderWidth + 15 + cornerSize) }
            ];
    
            corners.forEach(corner => {
                doc.save()
                   .translate(corner.x, corner.y)
                   .path('M 0,0 L ' + cornerSize + ',0 M 0,0 L 0,' + cornerSize)
                   .lineWidth(4)
                   .stroke(colors.gold)
                   .restore();
            });
    
            // Certificate seal
            const sealSize = 120;
            const sealX = doc.page.width / 2 - sealSize / 2;
            const sealY = doc.page.height - 200;
    
            // Outer circle
            doc.save()
               .translate(sealX + sealSize / 2, sealY + sealSize / 2)
               .circle(0, 0, sealSize / 2)
               .lineWidth(3)
               .stroke(colors.gold);
    
            // Inner circle
            doc.circle(0, 0, sealSize / 2 - 10)
               .lineWidth(1)
               .stroke(colors.accent)
               .restore();
    
            // Signature section
            const signatureY = doc.page.height - 120;
            
            // Instructor signature line
            doc.moveTo(doc.page.width * 0.2, signatureY)
               .lineTo(doc.page.width * 0.4, signatureY)
               .lineWidth(1)
               .stroke(colors.primary);
    
            // Certificate ID signature line
            doc.moveTo(doc.page.width * 0.6, signatureY)
               .lineTo(doc.page.width * 0.8, signatureY)
               .lineWidth(1)
               .stroke(colors.primary);
    
            // Instructor name and title
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .text(instructorName, doc.page.width * 0.2, signatureY + 10, {
                   width: doc.page.width * 0.2,
                   align: 'center'
               })
               .fontSize(12)
               .font('Helvetica')
               .text('Course Instructor', doc.page.width * 0.2, signatureY + 30, {
                   width: doc.page.width * 0.2,
                   align: 'center'
               });
    
            // Certificate ID section
            const certificateId = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .text(certificateId, doc.page.width * 0.6, signatureY + 10, {
                   width: doc.page.width * 0.2,
                   align: 'center'
               })
               .fontSize(12)
               .font('Helvetica')
               .text('Certificate ID', doc.page.width * 0.6, signatureY + 30, {
                   width: doc.page.width * 0.2,
                   align: 'center'
               });
    
            doc.end();
        });
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
        const existingCertificate=await this._certificateRepository.findByUserAndCourse(userId,courseObjectId)

        if(existingCertificate){
            return existingCertificate
        }

        //fetching course and user details for showingg in certificate
        const course=await this._courseRepository.findById(courseId)
        if(!course){
            throw new Error('Course not found')
        }

        const user=await this._userRepository.findById(userId.toString())

        if(!user){
            throw new NotFoundException('User not found')
        }

        //finding instructor for certificate
        const instructor=await this._instructorRepository.findById(course.instructor.toString())

        if(!instructor){
            throw new NotFoundException('Instructor not found')
        }

        //we can generate pdf now
        const pdfBuffer=await this.generatePDF(user.username,course.title,completionDate,instructor.name)

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


        const certificateUrl=await this._cloudinaryService.UploadedFile(file)

        

        return this._certificateRepository.create({
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

        const  result=await this._certificateRepository.findByUser(userId,page,limit)

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
        const certificate=await this._certificateRepository.findById(id)

        if(!certificate){
            throw new NotFoundException('Certificate not found')
        }

        return certificate
    }


}
