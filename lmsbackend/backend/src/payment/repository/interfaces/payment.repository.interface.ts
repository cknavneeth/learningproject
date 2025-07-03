import { ObjectId, Types } from "mongoose";
import { Payment, PaymentDocument } from "src/payment/schema/payment.schema";
import { coursePurchaseDocument } from "src/payment/schema/purchased.schema";

import { ICoursePurchase } from 'src/common/interfaces/payment.interface';
import { CreateOrderDto } from "src/payment/dto/create-order.dto";

export interface IPaymentRepository{
    create(paymentData:Partial<Payment>):Promise<PaymentDocument>
    findByOrderId(orderId:string):Promise<PaymentDocument|null>
    updatePaymentStatus(orderId:string,status:string,paymentId:string):Promise<PaymentDocument|null>
    findByUserId(userId:string):Promise<PaymentDocument[]>

    findLatestPaymentByCourse(userId:string,courseId:string):Promise<PaymentDocument|null>

    updateCourseCancellationStatus(paymentId:string,courseId:string,reason:string):Promise<PaymentDocument|null>

    coursepurchaseSave(doc:ICoursePurchase):Promise<coursePurchaseDocument|null>

    findPurchased(userId:string,courseIds:Types.ObjectId[]):Promise<ICoursePurchase[]>

    createwalletPay(paymentData:CreateOrderDto,userId:string,orderId:string,paymentId:string):Promise<PaymentDocument|null>
}