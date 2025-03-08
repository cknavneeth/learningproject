import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { user, userDocument } from './users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {

    constructor(@InjectModel(user.name) private usermodel:Model<userDocument>){}

    async findByEmail(email:string):Promise<userDocument | null>{
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
    
}
