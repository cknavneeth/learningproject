import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type userDocument = user & Document

export enum UserRole {
    STUDENT = 'student'
}

@Schema()
export class user{
    _id: Types.ObjectId;

    @Prop({required:true})
    username:string

    @Prop({required:true,unique:true})
    email:string

    @Prop({required:true})
    password:string

    @Prop({default:false})
    isVerified:boolean

    @Prop({type:String,required:false})
    otp?:string | null

    @Prop({type:String,required:false})
    otpExpires?:Date  | null

    @Prop({type:Boolean,default:false})
    isBlocked:boolean

    @Prop({type:String,enum:UserRole,default:UserRole.STUDENT})
    role:UserRole

}

export const userSchema=SchemaFactory.createForClass(user)