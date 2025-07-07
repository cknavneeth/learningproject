import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types,Document } from "mongoose";


export type payoutDocument = Payout & Document

@Schema()
export class Payout{
    
    @Prop({required:true,type:Types.ObjectId,ref:'instructor'})
    instructorId:Types.ObjectId

    @Prop()
    name:string

    @Prop()
    email:string

    @Prop()
    phone:string

    @Prop({required:true})
    ifsc:string

    @Prop({required:true})
    accountNumber:string

    @Prop()
    accountHolderName?:string

    @Prop()
    razorpayContactId:string

    @Prop()
    razorpayFundAccountId:string
}

export const InstructorPayoutSchema=SchemaFactory.createForClass(Payout)