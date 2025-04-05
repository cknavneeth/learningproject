import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { admin, admindocument } from './admin.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { user, userDocument } from 'src/users/users.schema';
import { instructor, instructorDocument } from 'src/instructors/instructor.schema';
import { AdminRepository } from './repositories/admin/admin.repository';
import { EmailService } from 'src/shared/email/email.service';

@Injectable()
export class AdminService {
    constructor(@InjectModel(admin.name) private adminmodel:Model<admindocument>,
    @InjectModel(user.name) private usermodel:Model<userDocument>,
    @InjectModel(instructor.name) private instructorModel:Model<instructorDocument>,
    private readonly adminRepository:AdminRepository,
    private readonly emailService:EmailService
 ){}

    async findbyEmail(email:string){
        let admin=await this.adminmodel.findOne({email})
        return admin
    }

    async fetchallstudents(){
        return this.usermodel.find().select('username email isBlocked isVerified').sort({createdAt:-1})
    }

    async toggleBlockStatus(studentId:string):Promise<user>{

        if(!studentId){
            throw new NotFoundException('student not found')
        }

        if (!Types.ObjectId.isValid(studentId)) {
            throw new BadRequestException('Invalid student ID format');
        }

        const student=await this.usermodel.findById(studentId)
        if(!student){
            throw new NotFoundException('student not found')
        }
        const updatedStudent=await this.usermodel.findByIdAndUpdate(studentId,{isBlocked:!student.isBlocked},{new:true})

        if(!updatedStudent){
            throw new NotFoundException('Failed to update student')
        }
        return updatedStudent!
    }

    async fetchallinstructors(){
        return this.instructorModel.find().select('name emailaddress isBlocked isVerified isApproved certificateUrl')
    }

    async blockstatus(instructorId:string){
        if(!instructorId){
            throw new NotFoundException('instructor not found')
        }

        if(!Types.ObjectId.isValid(instructorId)){
            throw new BadRequestException('Invalid instructor ID format')
        }

        const instructor=await this.instructorModel.findById(instructorId)
        if(!instructor){
            throw new NotFoundException('instructor not found')
        }

        const updatedInstructor=await this.instructorModel.findByIdAndUpdate(instructorId,{isBlocked:!instructor.isBlocked},{new:true})

        if(!updatedInstructor){
            throw new NotFoundException('Failed to update instructor')
        }

        return updatedInstructor!
    }



    async verifyinstructor(instructorId:string,isApproved:boolean,feedback?:string){
        if(!instructorId){
            throw new NotFoundException('instructor not found')
        }
        if(!Types.ObjectId.isValid(instructorId)){
            throw new BadRequestException('Invalid instructor ID format')
        }

        let instructor=await this.instructorModel.findById(instructorId)
        if(!instructor){
            throw new NotFoundException('instructor not found')
        }
        instructor.isApproved=isApproved
        if(!isApproved&&feedback){
            instructor.rejectionFeedback=feedback
            instructor.rejectedAt=new Date()
            instructor.canReapply=true
        }else{
            instructor.rejectionFeedback=undefined
            instructor.rejectedAt=undefined
            instructor.canReapply=false
        }
        await instructor.save()
        return instructor


    }


    async getAllCourses(){
        return this.adminRepository.getAllCourses()
    }

    async updateCourseStatus(courseId:string,isApproved:boolean,feedback?:string){
        console.log('ingot ethiyo')
        const course=await this.adminRepository.updateCourseStatus(courseId,isApproved,feedback)

        if(!course){
            throw new NotFoundException('Failed to update course')
        }

        const instructorEmail=course.instructor['emailaddress']
        const courseName = course.title;

        console.log('Course details:', { instructorEmail, courseName, isApproved });
        if (isApproved) {
            await this.emailService.sendCourseApprovalEmail(instructorEmail, courseName);
        } else {
            console.log('hmmmr reject aay')
            await this.emailService.sendCourseRejectionEmail(instructorEmail, courseName, feedback||'No feedback provided');
        }

        return course;
    }



}
