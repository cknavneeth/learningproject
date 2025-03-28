import { Prop ,Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type instructorDocument=instructor & Document

export enum InstructorRole {
    INSTRUCTOR = 'instructor'
}

@Schema()
export class instructor{

    _id: Types.ObjectId;

    @Prop({required:true})
    username:string

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

    @Prop({type:Boolean,default:false})
    isBlocked:boolean

    @Prop({type:String,enum:InstructorRole,default:InstructorRole.INSTRUCTOR})
    role:InstructorRole

    @Prop({type:String,required:false})
    rejectionFeedback?:string

    @Prop({type:Boolean,default:true})
    canReapply:boolean

    @Prop({type:Date,required:false})
    rejectedAt?:Date

    @Prop()
    phone:string

    @Prop()
    bio:string

    @Prop()
    googleId:string

    @Prop()
    isGoogleUser:boolean

}

export const instructorSchema=SchemaFactory.createForClass(instructor)