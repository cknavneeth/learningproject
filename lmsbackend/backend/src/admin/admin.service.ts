import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { admin, admindocument } from './admin.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { user, userDocument } from 'src/users/users.schema';
import { instructor, instructorDocument } from 'src/instructors/instructor.schema';

@Injectable()
export class AdminService {
    constructor(@InjectModel(admin.name) private adminmodel:Model<admindocument>,
    @InjectModel(user.name) private usermodel:Model<userDocument>,
    @InjectModel(instructor.name) private instructorModel:Model<instructorDocument>
 ){}

    async findbyEmail(email:string){
        let admin=await this.adminmodel.findOne({email})
        return admin
    }

    async fetchallstudents(){
        return this.usermodel.find().select('username email isBlocked isVerified')
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



    async verifyinstructor(instructorId:string,isApproved:boolean){
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
        await instructor.save()
        return instructor


    }
}
