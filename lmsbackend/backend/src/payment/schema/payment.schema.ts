import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum CancellationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
  }

export type PaymentDocument = Payment & Document;





@Schema()
export class CoursePaymentDetail{

    

    @Prop({type: Types.ObjectId, ref: 'Course'})
    courseId: Types.ObjectId;

    @Prop({required: true})
    amount: number;

    @Prop({enum: ['active', 'cancelled', 'cancellation_pending'], default: 'active'})
    status: string;

    @Prop()
    cancellationReason?: string;

    @Prop()
    cancellationDate?: Date;

    @Prop({type: String, enum: CancellationStatus})
    cancellationStatus?: CancellationStatus;


}

@Schema({timestamps:true})
export class Payment{

    _id: Types.ObjectId;


    @Prop({required:true})
    orderId:string

    @Prop()
    paymentId:string

    @Prop({required:true})
    amount:number;

    @Prop({required:true})
    currency:string

    @Prop({type:Types.ObjectId,ref:'user',required:true})
    userId:Types.ObjectId

    @Prop({type:[CoursePaymentDetail] })
    coursesDetails:CoursePaymentDetail[]


    @Prop({type:Types.ObjectId,ref:'Coupon'})
    couponUsed:Types.ObjectId

    @Prop({enum :['pending','completed','failed','cancelled'],default:'pending'})
    status:string

    @Prop({default:Date.now})
    purchaseDate:Date

    // @Prop()
    // cancellationReason?:string
    
    // @Prop()
    // cancellationDate?:Date


    // @Prop({type:String,enum:CancellationStatus})
    // cancellationStatus?:CancellationStatus


}





export const PaymentSchema = SchemaFactory.createForClass(Payment);