import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({timestamps:true})
export class Payment{
    @Prop({required:true})
    orderId:string

    @Prop()
    paymentId:string

    @Prop({required:true})
    amount:number;

    @Prop({required:true})
    currency:string

    @Prop({type:Types.ObjectId,ref:'User',required:true})
    userId:Types.ObjectId

    @Prop({type:[{type:Types.ObjectId,ref:'Course'}] })
    courses:Types.ObjectId[]


    @Prop({type:Types.ObjectId,ref:'Coupon'})
    couponUsed:Types.ObjectId

    @Prop({enum :['pending','completed','failed'],default:'pending'})
    status:string
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);