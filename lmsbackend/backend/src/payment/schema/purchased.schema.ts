import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type coursePurchaseDocument = Document & coursePurchased

@Schema({})
export class coursePurchased{
    
     @Prop({type:Types.ObjectId,ref:'user',required:true})
     userId:Types.ObjectId

     @Prop({type:Types.ObjectId,ref:'Course',required:true})
     courseId:Types.ObjectId

     @Prop({type:Types.ObjectId,ref:'payment',required:true})
     paymentId:Types.ObjectId

     @Prop({default:Date.now(),required:true})
     purchasedDate:Date

}

export const coursepurchaseSchema=SchemaFactory.createForClass(coursePurchased)

coursepurchaseSchema.index({userId:1,courseId:1},{unique:true})