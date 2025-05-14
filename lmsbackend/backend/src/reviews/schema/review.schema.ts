
import mongoose, {  Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument=Review & Document


@Schema({timestamps:true})
export class Review{

    _id: Types.ObjectId;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'user',required:true})
    userId:Types.ObjectId

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'Course',required:true})
    courseId:Types.ObjectId

    @Prop({required:true})
    rating:number

    @Prop({required:true})
    comment:string

    @Prop({default:false})
    isEdited:boolean

    //new fields for instructor
    @Prop({type:String,required:false})
    instructorReply:string


    @Prop({default:false})
    hasInstructorReply:boolean

    @Prop({type:Date,required:false})
    instructorReplyDate:Date
}

export const ReviewSchema=SchemaFactory.createForClass(Review)