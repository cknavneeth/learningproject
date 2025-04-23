import { CreateOrderDto } from "src/payment/dto/create-order.dto";
import { VerifyPaymentDto } from "src/payment/dto/verify-payment.dto";
import { Payment } from "src/payment/schema/payment.schema";

export interface IPaymentService{
    createOrder(createOrderDto:CreateOrderDto):Promise<{id:string;amount:number;currency:string}>

    verifyPayment(verifyPaymentDto:VerifyPaymentDto):Promise<Payment|null>

    getPaymentHistory(userId:string)

    requestCourseCancellation(userId:string,courseId:string,reason:string):Promise<Payment>
}