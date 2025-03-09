import { Prop ,Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type instructorDocument=instructor & Document

@Schema()
export class instructor{

    _id: Types.ObjectId;

    @Prop({required:true})
    name:string

    @Prop({required:true,unique:true})
    emailaddress:string

    @Prop({required:true})
    password:string

    @Prop({required:true})
    certificateUrl:string

    @Prop({default:false})
    isApproved:boolean

    @Prop({default:false})
    isVerified:boolean

    @Prop({type:String,required:false})
    otp?:string|null

    @Prop({type:String,required:false})
    otpExpires?:Date | null
}

export const instructorSchema=SchemaFactory.createForClass(instructor)