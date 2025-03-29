import { Injectable, NotFoundException } from '@nestjs/common';
import { IInstructorRepository } from '../instructor.repository.interface';
import { userDocument } from 'src/users/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { instructor, instructorDocument } from 'src/instructors/instructor.schema';
import { Model } from 'mongoose';

@Injectable()
export class InstructorRepository implements IInstructorRepository{

    constructor(@InjectModel(instructor.name) private instructorModel:Model<instructorDocument>){}

     async findById(instructorId:string):Promise<instructorDocument|null>{
      return await this.instructorModel.findById(instructorId)
    }

    async updateProfile(instructorId:string,profileData:Partial<instructor>):Promise<instructorDocument>{
        const instructor=await this.instructorModel.findByIdAndUpdate(instructorId,{$set:profileData},{new:true})
        if(!instructor){
            throw new Error('instructor not found')
        }
        return instructor
    }


    async updatePassword(instructorId:string,hashedpassword:string):Promise<void>{
        await this.instructorModel.findByIdAndUpdate(instructorId,{$set:{password:hashedpassword}}).exec()
    }


    async updateReapplyStatus(instructorId:string,canReapply:boolean):Promise<instructorDocument>{
        const instructor=await this.instructorModel.findByIdAndUpdate(instructorId,{
            $set:{
                canReapply:canReapply,
                isApproved:false,
                rejectionFeedback:null,
                rejectedAt:null
            }
        },{new:true})

        if(!instructor){
            throw new NotFoundException('instructor not found')
        }
        return instructor
    }

}
