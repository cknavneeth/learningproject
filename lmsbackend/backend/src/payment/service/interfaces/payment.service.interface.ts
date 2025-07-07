import { PayoutResponse } from "src/common/interfaces/payoutRequest.interface";
import { CreateOrderDto } from "src/payment/dto/create-order.dto";
import { InstructorPayoutDto } from "src/payment/dto/instructor-payout.dto";
import { InstructorPayoutRequestDto } from "src/payment/dto/instructorpayout-request.dto";
import { VerifyPaymentDto } from "src/payment/dto/verify-payment.dto";
import { Payment } from "src/payment/schema/payment.schema";
import { Payout, payoutDocument } from "src/payment/schema/payout.schema";

export interface IPaymentService{
    createOrder(createOrderDto:CreateOrderDto):Promise<{id:string;amount:number;currency:string}>

    verifyPayment(verifyPaymentDto:VerifyPaymentDto):Promise<Payment|null>

    getPaymentHistory(userId:string)

    requestCourseCancellation(userId:string,courseId:string,reason:string):Promise<Payment>

    payusingWallet(createOrderDto:CreateOrderDto,userId:string)

    createPayout(instructorPayoutDto:InstructorPayoutDto,instructorId:string):Promise<payoutDocument|null>

    makePayout(instructorPayoutRequestDto:InstructorPayoutRequestDto,instructorId:string):Promise<PayoutResponse>
}