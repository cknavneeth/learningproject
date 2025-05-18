import { Payment, PaymentDocument } from "src/payment/schema/payment.schema";

export interface IPaymentRepository{
    create(paymentData:Partial<Payment>):Promise<PaymentDocument>
    findByOrderId(orderId:string):Promise<PaymentDocument|null>
    updatePaymentStatus(orderId:string,status:string,paymentId:string):Promise<PaymentDocument|null>
    findByUserId(userId:string):Promise<PaymentDocument[]>

    findLatestPaymentByCourse(userId:string,courseId:string):Promise<PaymentDocument|null>

    updateCourseCancellationStatus(paymentId:string,courseId:string,reason:string):Promise<PaymentDocument|null>
}