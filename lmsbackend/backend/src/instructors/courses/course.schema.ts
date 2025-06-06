import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


export type CourseDocument=Course & Document

export enum CourseStatus{
    DRAFT='draft',
    PENDING_REVIEW='pending_review',
    PUBLISHED='published',
    REJECTED='rejected'
}

@Schema()
export class Offer{
    @Prop({required:true})
    percentage:number

    @Prop({required:true})
    discountPrice:number

    @Prop({default:Date.now})
    createdAt:Date
}

@Schema({timestamps:true})
export class Course {

     _id: Types.ObjectId; 

    @Prop({required:true})
    title:string

    @Prop({required:true})
    category:string

    @Prop({required:true})
    duration:number

    @Prop({required:function(){
        return this.status!==CourseStatus.DRAFT
    }})
    description:string

    @Prop({required:true})
    price:number

    @Prop({required:true})
    courseTopic:string

    @Prop({required:true})
    courseLanguage:string

    @Prop({required:true})
    courseLevel:string

    @Prop()
    thumbnailUrl:string

    @Prop()
    courseRequirements:string[]

    @Prop([String])
    targetAudience:string[]

    @Prop([String])
    learningOutcomes:string[]

    @Prop({type:[{
          title:String,
          description:String,
          videoUrl:String,
          duration:Number,
          order:Number,
          resources:[{
            title:String,
            fileUrl:String,
            fileType:String
          }]
    }]})
    sections:{
        title:string,
        description:string,
        videoUrl:string,
        duration:number,
        order:number,
        resources:{
            title:string,
            fileUrl:string,
            fileType:string
        }[];
    }[];

    @Prop({type:Types.ObjectId,ref:'instructor',required:true})
    instructor:Types.ObjectId

    @Prop({type:String,enum:CourseStatus,default:CourseStatus.DRAFT})
    status:CourseStatus

    @Prop()
    feedback?:string;

    @Prop()
    approvedAt?:Date


    @Prop({type:Offer})
    offer:Offer

}


export const CourseSchema=SchemaFactory.createForClass(Course)

