import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from './interfaces/payment.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from '../schema/payment.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class paymentRepository implements IPaymentRepository{
    constructor(@InjectModel(Payment.name) private paymentModel:Model<PaymentDocument>){}


    async create(paymentData:Partial<Payment>):Promise<PaymentDocument>{
        console.log('ohh order save avumallo')
        const payment=new this.paymentModel(paymentData)
        return payment.save()
    }

    async updatePaymentStatus(orderId:string,status:string,paymentId:string):Promise<PaymentDocument|null>{
        return this.paymentModel.findOneAndUpdate(
            {orderId},
            {$set:{
                status,
                paymentId
            }},
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

      
    async findLatestPaymentByCourse(userId:string,courseId:string):Promise<PaymentDocument|null>{
        return this.paymentModel.findOne({
            userId:new Types.ObjectId(userId),
            'coursesDetails':{
                $elemMatch:{
                    courseId:new Types.ObjectId(courseId),
                    status:'active'
                }
            }
        })
        .sort({createdAt:-1})
        .exec()
    }


    async updateCourseCancellationStatus(paymentId: string, courseId: string, reason: string): Promise<PaymentDocument | null> {
        return this.paymentModel.findOneAndUpdate({
            _id:paymentId,
            'coursesDetails.courseId':new Types.ObjectId(courseId)
        },
        {
            $set:{
                'coursesDetails.$.status':'cancellation_pending',
                'coursesDetails.$.cancellationReason':reason,
                'coursesDetails.$.cancellationDate':new Date()
            }
        },
        {new :true}
    )
    .populate('coursesDetails.courseId')
    .exec()
    }

}
