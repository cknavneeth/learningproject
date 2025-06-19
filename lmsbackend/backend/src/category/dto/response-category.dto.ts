import { Exclude,Expose } from "class-transformer";
import { ObjectId } from "mongoose";

export class ResponseCategoryDto{

    @Expose()
    _id:ObjectId

    @Expose()
    name:string

    @Expose()
    description:string

    @Exclude()
    _v:number

    constructor(partial: Partial<ResponseCategoryDto>){
        Object.assign(this,partial)
    }

}

