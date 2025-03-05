import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type userDocument = user & Document
@Schema()
export class user{

    @Prop({required:true})
    username:string

    @Prop({required:true,unique:true})
    email:string

    @Prop({required:true})
    password:string

    @Prop({default:false})
    isBlocked:boolean

    @Prop()
    otp:string

    @Prop()
    otpExpires:Date

}

export const userSchema=SchemaFactory.createForClass(user)