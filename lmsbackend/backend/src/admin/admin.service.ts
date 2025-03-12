import { Injectable } from '@nestjs/common';
import { admin, admindocument } from './admin.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AdminService {
    constructor(@InjectModel(admin.name) private adminmodel:Model<admindocument> ){}

    async findbyEmail(email:string){
        let admin=await this.adminmodel.findById(email)
        return admin
    }
}
