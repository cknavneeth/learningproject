import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { instructor, instructorDocument } from './instructor.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class InstructorsService {
    constructor(@InjectModel(instructor.name) private instructorModel:Model<instructorDocument>){}

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
}
