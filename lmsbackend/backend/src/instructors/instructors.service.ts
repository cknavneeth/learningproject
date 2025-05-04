import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { instructor, instructorDocument } from './instructor.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'
import { InstructorRepository } from './repositories/instructor/instructor.repository';

@Injectable()
export class InstructorsService {
    constructor(@InjectModel(instructor.name) private instructorModel:Model<instructorDocument>,private readonly instructorRepository:InstructorRepository){}

    async createInstructor(name:string,emailaddress:string,password:string,certificateUrl:string):Promise<instructor | null>{
        let hashedPassword=await bcrypt.hash(password,10)
        const newInstructor=new this.instructorModel({name,emailaddress,password:hashedPassword,certificateUrl})
        console.log("Saving Instructor:", newInstructor);
        return newInstructor.save()
    }

    async findByEmail(emailaddress:string):Promise<instructorDocument | null>{
        return this.instructorModel.findOne({emailaddress}).exec()
    }

    async updateinstructor(emailaddress:string,updatedData:Partial<instructor>){
        await this.instructorModel.findOneAndUpdate(
            {emailaddress} ,
            {$set:updatedData},
            {new:true}
        )
    }

    async comparePassword(password:string,storedHashedPassword:string){
        return await bcrypt.compare(password,storedHashedPassword)
    }

    async findById(instructorId:string){
        let instructor=await this.instructorModel.findById(instructorId)
        return instructor
    }

    async updatePassword(emailaddress:string,hashedpassword:string){
        await this.instructorModel.findOneAndUpdate({emailaddress},{password:hashedpassword})
    }


    async getProfile(instructorId:string){
        const instructor=await this.instructorRepository.findById(instructorId)
        if(!instructor){
            throw new NotFoundException('instructor not found')
        }

        const {password,...instructorProfile}=instructor.toObject()

        return instructorProfile
    }


    async updateProfile(instructorId:string,profileData:Partial<any>){
        const instructor=await this.instructorRepository.findById(instructorId)
        if(!instructor){
            throw new NotFoundException('instructor not found')
        }

        const updatedInstructor=await this.instructorRepository.updateProfile(instructorId,{
            name:profileData.username,
            phone:profileData.phone,
            bio:profileData.bio
        })

        const {password,...instructorProfile}=updatedInstructor.toObject()

        return {
            message:'Profile updated successfully',
            instructorProfile
        }
    }

    async resetPassword(instructorId:string,passwordData:{currentPassword:string,newPassword:string}){
        const instructor=await this.instructorRepository.findById(instructorId)
        if(!instructor){
            throw new NotFoundException('instructor not found')
        }
        console.log('Current password provided:', passwordData.currentPassword);
        console.log('Stored hashed password:', instructor.password);
        const isPasswordValid=await bcrypt.compare(passwordData.currentPassword,instructor.password)

        console.log('Password comparison result:', isPasswordValid);
        if(!isPasswordValid){
            throw new NotFoundException('Current password is not matching')
        }

       
        const hashedPassword=await bcrypt.hash(passwordData.newPassword,10)

        await this.instructorRepository.updatePassword(instructorId,hashedPassword)

        return {message:'password updated successfully'}
    }


    async reapplyAsInstructor(instructorId:string){

        console.log('reapply request received in service')
        //first i can check the status of instructor
        const instructor=await this.instructorRepository.findById(instructorId)
        if(!instructor){
            throw new NotFoundException('instructor not found')
        }
        if(!instructor.canReapply){
            throw new NotFoundException('You cannot reapply')
        }
        if(instructor.isBlocked){
            throw new NotFoundException('You are Blocked')
        }
        if (instructor.rejectedAt) {
            const twentyFourHoursAgo = new Date(Date.now() - 1 * 60 * 1000);
            if (instructor.rejectedAt > twentyFourHoursAgo) {
                const hoursLeft = Math.ceil(
                    (instructor.rejectedAt.getTime() - twentyFourHoursAgo.getTime()) / (1000 * 60 * 60)
                );
                throw new BadRequestException(
                    `Please wait ${hoursLeft} more hours before reapplying`
                );
            }
        }
        const updatedInstructor=await this.instructorRepository.updateReapplyStatus(instructorId,false)

        return {
            success:true,
            message:'Reapply request sent successfully'
        }
    }



    //get instructor dashboard stats
    async getDashboardStats(instructorId:string){
        return this.instructorRepository.getDashboardStats(instructorId)
    }
}
