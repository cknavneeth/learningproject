import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { user, userDocument } from './users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'
import { UserRepository } from './repositories/user/user.repository';

@Injectable()
export class UsersService {

    constructor(@InjectModel(user.name) private usermodel:Model<userDocument>,private readonly userRepository:UserRepository){}

    async findByEmail(email:string):Promise<userDocument|null>{
       return  this.usermodel.findOne({email}).exec()
    }


    async createUser(username:string,email:string,password:string):Promise<user | null>{
         let hashedPassword=await bcrypt.hash(password,10)
         const newUser=new this.usermodel({username,email,password:hashedPassword})
         return newUser.save()
    }

   async updateUser(email:string, updatedData:Partial<user>){
        await this.usermodel.findOneAndUpdate(
            {email},
            {$set:updatedData},
            {new:true}
        )
   }

   async comparePassword(receivedPassword:string,storedHashedPassword:string):Promise<boolean>{
       return await bcrypt.compare(receivedPassword,storedHashedPassword)
   }

   async findById(user:string):Promise<userDocument|null>{
       let findeduser=await this.usermodel.findById(user)
       return findeduser
   }

   async updatepassword(userId:string,hashedpassword:string):Promise<void>{
    await this.usermodel.findByIdAndUpdate(userId,{password:hashedpassword})
   }



   async createGoogleUser(name: string, email: string, password: string,googleId:string): Promise<userDocument | null> {
    const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.usermodel({
            username: name,
            email,
            password: hashedPassword,
            isVerified: true, 
            googleId,
            isGoogleUser: true,
        });
        const savedUser = await newUser.save();
        if(!savedUser){
            throw new BadRequestException('Failed to create user')
        }
        return savedUser
   }



   //for profiling of students
   async getProfile(userId:string){
    const user=await this.userRepository.findById(userId)
    if(!user){
        throw new BadRequestException('User not found')
    }

    const {password,...userProfile}=user.toObject()

    return userProfile
   }
    

   //updating profle
   async updateProfile(userId:string,profileData:Partial<user>){
    const user=await this.userRepository.findById(userId)
    if(!user){
        throw new BadRequestException('User not found')
    }
    const updateduser=await this.userRepository.updateProfile(userId,{
        username:profileData.username,
        phone:profileData.phone,
        bio:profileData.bio
    })

    if(!updateduser){
        throw new BadRequestException('Failed to update profile')
    }

    const {password,...userProfile}=updateduser.toObject()

    return {
        message:'Profile updated successfully',
        userProfile
    }
   }




   //updatestudentpassword
   async updateStudentPassword(userId:string,passwordData:{currentPassword:string,newPassword:string}){
        const user=await this.userRepository.findById(userId)
        if(!user){
            throw new BadRequestException('User not found')
        }

        //verify the confirm password here
        const isPasswordValid=await this.comparePassword(passwordData.currentPassword,user.password)
        if(!isPasswordValid){
            throw new BadRequestException('Current password is not matching')
        }

        const hashedPassword=await bcrypt.hash(passwordData.newPassword,10)

        await this.updatepassword(userId,hashedPassword)

        return {message:'password updated succesfully'}
   }




   //getting all courses here
   async getAllPublishedCourses(){
    return await this.userRepository.getAllPublishedCourses()
   }
   
}
