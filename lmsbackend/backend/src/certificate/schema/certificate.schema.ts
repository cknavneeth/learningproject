import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document, Types } from "mongoose";

export type CertificateDocument=Certificate & Document

@Schema({timestamps:true})
export class Certificate{
    @Prop({type:Types.ObjectId,ref:'User',required:true})
    userId:Types.ObjectId

    @Prop({type:Types.ObjectId,ref:'Course',required:true})
    courseId:Types.ObjectId

    @Prop({required:true})
    courseName:string

    @Prop()
    instructorName?:string

    @Prop({required:true})
    completionDate:Date

    @Prop({required:true})
    certificateUrl:string
}

export const CertificateSchema=SchemaFactory.createForClass(Certificate)