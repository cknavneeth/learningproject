import { Expose, Type } from "class-transformer";
import { Types } from "mongoose";

export class instructorDto{

    @Expose()
    name:String
}

export class wishlistCourseDto{

    @Expose()
    _id:Types.ObjectId

    @Expose()
    title:String

    @Expose()
    price:number

    @Expose()
    thumbnailUrl:String

    @Expose()
    @Type(()=>instructorDto)
    instructor:instructorDto
}


export class wishlistResponseDto{
    
    @Expose()
    _id:Types.ObjectId

    @Expose()
    user:Types.ObjectId

    @Expose()
    @Type(()=>wishlistCourseDto)
    courses:wishlistCourseDto[]


    constructor(partial:Partial<wishlistResponseDto>){
           Object.assign(this,partial)
    }
    
}