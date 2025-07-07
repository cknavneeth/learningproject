import { Types } from "mongoose"

export interface PayoutResponse{
    success:boolean,
    message:string,
    payoutId:string,
    status:string
}

export interface PayoutSave{
    instructorId:Types.ObjectId,
    amount:number,
    razorpayPayoutId:string,
    status:string
}

export interface PayoutDetailsResponse{
    name:string,
    email:string,
    phone?:string,
    accountNumber:string,
    accountHolderName:string
}