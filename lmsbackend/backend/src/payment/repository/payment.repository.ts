import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { IPaymentRepository } from './interfaces/payment.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from '../schema/payment.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { coursePurchased, coursePurchaseDocument } from '../schema/purchased.schema';


import { ICoursePurchase } from 'src/common/interfaces/payment.interface';
import { InternalServerError } from 'openai';
import { CreateOrderDto } from '../dto/create-order.dto';
import { MESSAGE } from 'src/common/constants/messages.constants';

@Injectable()
export class paymentRepository implements IPaymentRepository{
    constructor(
        @InjectModel(Payment.name) private paymentModel:Model<PaymentDocument>,
        @InjectModel(coursePurchased.name) private _coursePurchaseModel:Model<coursePurchaseDocument>
    ){}

    private logger=new Logger()


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


    async coursepurchaseSave(doc:ICoursePurchase):Promise<coursePurchaseDocument|null>{
             
        try {
            const savingDoc=new this._coursePurchaseModel(doc)
            const document= await savingDoc.save()
            return document
        } catch (error) {
            console.error('Error in course purchase save')
            throw error
        }
    }


    async findPurchased(userId: string, courseIds: Types.ObjectId[]): Promise<ICoursePurchase[]> {
        try {
            const studentId=new Types.ObjectId(userId)
            const purchased=await this._coursePurchaseModel.find({
                userId:studentId,
                courseId:{$in:courseIds}
            }).select('courseId')
            .lean()

            return purchased
        } catch (error) {
            throw new InternalServerErrorException('something went wrong')
        }
    }




    async createwalletPay(paymentData: CreateOrderDto, userId: string, orderId:string,paymentId:string): Promise<PaymentDocument | null> {
        try {

            this.logger.log('paymentData in repo',paymentData)

            const courseIds=paymentData.items.filter(id=>Types.ObjectId.isValid(id)).map(id=>new Types.ObjectId(id))
            
            const alreadyExists=await this._coursePurchaseModel.find({
                userId:userId,
                courseId:{$in:courseIds}
            })

            if(alreadyExists.length>0){
                throw new BadRequestException(MESSAGE.PAYMENT.ALREADY_PURCHASED)
            }

            const paymentSaving=await this.paymentModel.create({
                orderId:orderId,
                userId:new Types.ObjectId(userId),
                paymentId:paymentId,
                amount:paymentData.amount,
                currency:"INR",
                coursesDetails:courseIds.map(courseId=>({
                    courseId,
                    amount:paymentData.amount,
                    status:'active'
                })),
                couponUsed:paymentData?.coupon,
                status:'completed',
                purchaseDate:Date.now(),
                paymentMethod:'wallet'
            })

            if(!paymentSaving){
                throw new BadRequestException(MESSAGE.PAYMENT.NOT_SAVED)
            }

            for(let course of courseIds){
                await this._coursePurchaseModel.create({
                    userId:new Types.ObjectId(userId),
                    courseId:course,
                    paymentId:paymentId,
                    purchasedDate:Date.now()
                })
            }

            return paymentSaving
        } catch (error) {
             if(error.code===11000){
                throw new BadRequestException(MESSAGE.PAYMENT.ALREADY_PURCHASED)
             }
              if(error instanceof HttpException){
                throw error
              }
              throw new InternalServerErrorException(error?.message||MESSAGE.PAYMENT.INTERNAL_SERVER_ERROR)
        }
    }

}
