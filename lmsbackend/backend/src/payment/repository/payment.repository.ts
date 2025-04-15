import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from './interfaces/payment.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from '../schema/payment.schema';
import { Model } from 'mongoose';

@Injectable()
export class paymentRepository implements IPaymentRepository{
    constructor(@InjectModel(Payment.name) private paymentModel:Model<PaymentDocument>){}


    async create(paymentData:Partial<Payment>):Promise<PaymentDocument>{
        console.log('ohh order save avumallo')
        const payment=new this.paymentModel(paymentData)
        return payment.save()
    }

    async updatePaymentStatus(paymentId:string,status:string):Promise<PaymentDocument|null>{
        return this.paymentModel.findOneAndUpdate(
            {paymentId},
            {status},
            {new:true}
        )
        .exec()
    }

    async findByUserId(userId:string):Promise<PaymentDocument[]>{
        return this.paymentModel
        .find({userId})
        .sort({createdAt:-1})
        .exec()
    }

    async findByOrderId(orderId: string): Promise<PaymentDocument|null> {
        return this.paymentModel.findOne({ orderId }).exec();
      }

      

}
