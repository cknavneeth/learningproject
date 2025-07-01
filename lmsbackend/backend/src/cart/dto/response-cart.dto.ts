import { Expose, Type } from "class-transformer";
import { Types } from "mongoose";


export class instructorDto{
    @Expose()
    name:String
}


export class courseDto{
    @Expose()
    _id:Types.ObjectId

    @Expose()
    title:String

    @Expose()
    thumbnailUrl:String

    @Expose()
    offer:string

    @Expose()
    @Type(()=>instructorDto)
    instructor:instructorDto
}

export class cartItemDto{
    @Expose()
    @Type(()=>courseDto)
    courseId:courseDto
}


export class responsecartDto{
    @Expose()
    _id:Types.ObjectId

    @Expose()
    userId:Types.ObjectId

    @Expose()
    @Type(()=>cartItemDto)
    items:cartItemDto

    constructor(partial:Partial<responsecartDto>){
        Object.assign(this,partial)
    }
}