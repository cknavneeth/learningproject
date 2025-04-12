import { Prop,Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

export enum CouponType{
   PERCENTAGE='percentage',
   FIXED='fixed'
}

export type CouponDocument=Coupon & Document

@Schema({timestamps:true})
export class Coupon{
    
   _id: Types.ObjectId;


    @Prop({required:true,unique:true})
    code:string

    @Prop({required:true})
    type:CouponType

    @Prop({ required: true })
    value: number;

    @Prop({ required: true })
    maxUses: number;

    @Prop({ default: 0 })
    currentUses: number;

    @Prop({ required: true })
    expiryDate: Date;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    description?: string;

    @Prop({ required: true })
    minPurchaseAmount: number;

    @Prop()
    maxDiscountAmount?: number;

}

export const CouponSchema=SchemaFactory.createForClass(Coupon)