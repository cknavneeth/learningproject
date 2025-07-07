import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types ,Document} from "mongoose";

export type payoutsuccessDocument=PayoutSuccess & Document

@Schema()
export class PayoutSuccess{
    
    @Prop({required:true,ref:'instructor'})
    instructorId:Types.ObjectId

    @Prop({required:true})
    amount:number

    @Prop({required:true})
    razorpayPayoutId:string

    @Prop({required:true,enum:['queued','pending','processing','processed','failed'], default:'pending'})
    status:string

    @Prop()
    payoutMode?:string

    
}

export const payoutsuccessSchema=SchemaFactory.createForClass(PayoutSuccess)