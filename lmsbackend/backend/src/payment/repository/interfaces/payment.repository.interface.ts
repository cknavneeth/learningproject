import { Payment, PaymentDocument } from "src/payment/schema/payment.schema";

export interface IPaymentRepository{
    create(paymentData:Partial<Payment>):Promise<PaymentDocument>
    findByOrderId(orderId:string):Promise<PaymentDocument|null>
    updatePaymentStatus(paymentId:string,status:string):Promise<PaymentDocument|null>
    findByUserId(userId:string):Promise<PaymentDocument[]>
}