import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../user.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user, userDocument } from 'src/users/users.schema';

@Injectable()
export class UserRepository implements IUserRepository{
     constructor(@InjectModel(user.name) private usermodel:Model<userDocument>){}

     async findById(userId:string):Promise<userDocument|null>{
         return this.usermodel.findById(userId).exec()
     }

    //  async updateProfile()
     
}
