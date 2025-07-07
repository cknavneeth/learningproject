import { Exclude, Expose } from "class-transformer";
import { PaymentDocument } from "../schema/payment.schema";


export class PayoutDetails{

    @Expose()
    name:string

    @Expose()
    email:string

    @Expose()
    phone:string

    @Expose()
    ifsc:string

    @Expose()
    accountNumber:string

    @Expose()
    accountHolderName:string

    @Exclude()
    razorpayContactId:string

    @Exclude()
    razorpayFundAccountId:string


    constructor(partial:Partial<PaymentDocument>){
        Object.assign(this,partial)
    }
}