import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type userDocument = user & Document

export enum UserRole {
    STUDENT = 'student'
}

export enum TransactionType{
    CREDIT='credit',
    DEBIT='debit'
}

@Schema()
export class WalletTransaction{
    @Prop({required:true,enum:TransactionType})
    type:TransactionType

    @Prop({required:true})
    amount:number

    @Prop({required:true,default:Date.now})
    date:Date

    @Prop()
    description:string
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


    @Prop({type: String, required: false, unique: true, sparse: true})
    googleId?: string

    @Prop({type: Boolean, default: false})
    isGoogleUser: boolean

    @Prop()
    phone:string

    @Prop()
    bio:string


    @Prop({default:0})
    wallet:number

    @Prop({type:[WalletTransaction],default:[]})
    transactions:WalletTransaction[]
}

export const userSchema=SchemaFactory.createForClass(user)