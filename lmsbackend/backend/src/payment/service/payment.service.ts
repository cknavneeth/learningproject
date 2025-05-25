import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { IPaymentService } from './interfaces/payment.service.interface';
import Razorpay from 'razorpay'; 
import * as crypto from 'crypto';
import { PAYMENT_REPOSITORY } from '../constants/payment-constant';
import { IPaymentRepository } from '../repository/interfaces/payment.repository.interface';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from '../dto/create-order.dto';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';
import { Payment } from '../schema/payment.schema';
import { Types } from 'mongoose';

@Injectable()
export class PaymentService implements IPaymentService{

    private readonly logger=new Logger(PaymentService.name)


    private razorpay:Razorpay

    constructor(@Inject(PAYMENT_REPOSITORY) private readonly paymentRepository:IPaymentRepository,private configService:ConfigService){
        const key_id = this.configService.get<string>('RAZORPAY_KEY_ID');
        const key_secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

        if (!key_id || !key_secret) {
            throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be provided');
        }

        this.razorpay = new Razorpay({
            key_id,
            key_secret
        });
    }



    async createOrder(createOrderDto: CreateOrderDto) {
        console.log('Received order request:', createOrderDto);
        try {
            
            const order = await this.razorpay.orders.create({
                amount: createOrderDto.amount,
                currency: createOrderDto.currency,
                receipt: `order_${Date.now()}`
            });
            console.log('Razorpay order created:', order);

            
            try {
                const amountInRupees = createOrderDto.amount / 100;
                const courseIds = createOrderDto.items
                .filter(id => Types.ObjectId.isValid(id))
                .map(id => new Types.ObjectId(id));

                console.log('Course IDs being saved:', courseIds);

                const userId = createOrderDto.userId;
                if (!userId) {
                    throw new BadRequestException('User ID is required');
                }



                const payment = await this.paymentRepository.create({
                    orderId: order.id,
                    amount: amountInRupees,
                    currency: order.currency,
                    status: 'pending',
                    coursesDetails:courseIds.map(courseId=>({
                        courseId,
                        amount:amountInRupees,
                        status:'active'
                    })) ,// Add items to track what's being purchased
                    userId:new Types.ObjectId(userId) // Add userId if available in DTO
                    
                });
                console.log('Payment record created:', payment);
            } catch (dbError) {
                console.error('Failed to create payment record:', dbError);
                // Continue even if payment record creation fails
                // We can handle this in the verification step
            }

            // 3. Return order details
            return {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                status: 'created'
            };

        } catch (error) {
            console.error('Order creation error:', {
                message: error.message,
                stack: error.stack,
                details: error.response?.data
            });
            throw new BadRequestException(`Failed to create order: ${error.message}`);
        }
    }



    async verifyPayment(verifyPaymentDto: VerifyPaymentDto): Promise<Payment | null> {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verifyPaymentDto;

        console.log('Verifying payment with data:', {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature
        });

        const key_secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
        if (!key_secret) {
            throw new Error('RAZORPAY_KEY_SECRET must be provided');
        }

        // 1. Verify signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", key_secret)
            .update(sign.toString())
            .digest("hex");

            console.log('Signature verification:', {
                generated: expectedSign,
                received: razorpay_signature
            });

        if (expectedSign !== razorpay_signature) {
            throw new BadRequestException('Invalid payment signature');
        }

        try {
            // Find the original payment record first
            const originalPayment = await this.paymentRepository.findByOrderId(razorpay_order_id);
            if (!originalPayment) {
                throw new BadRequestException('No payment record found for this order');
            }

            // 2. Update payment status
            const payment = await this.paymentRepository.updatePaymentStatus(
                razorpay_order_id,
                'completed',
                razorpay_payment_id
            );

            if (!payment) {

                this.logger.log('payment update avathond puthiyath indakam')
                // If update failed, create new payment record with userId from original payment
                const paymentDetails = await this.razorpay.payments.fetch(razorpay_payment_id);
                const newPayment = await this.paymentRepository.create({
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    amount: paymentDetails.amount / 100,
                    currency: paymentDetails.currency,
                    status: 'completed',
                    userId: originalPayment.userId,
                    coursesDetails: originalPayment.coursesDetails
                
                });
                return newPayment;
            }

            return payment;
        } catch (error) {
            console.error('Payment verification error:', error);
            throw new BadRequestException('Failed to verify payment');
        }
    }

    async getPaymentHistory(userId: string) {
        return this.paymentRepository.findByUserId(userId)
    }


    async requestCourseCancellation(userId:string,courseId:string,reason:string):Promise<Payment>{

        console.log('hello requestilek kerunnundo testing hnyy',userId,courseId,reason)
         const payment=await this.paymentRepository.findLatestPaymentByCourse(userId,courseId)

         console.log('Found payment:', payment); 

         if(!payment){
            throw new BadRequestException('No payment record found for this course')
         }

         

         console.log('CourseDetails:', payment.coursesDetails.map(detail => ({
            courseId: detail.courseId.toString(),
            status: detail.status
        })));
    

         const coursePurchase=payment.coursesDetails.find(detail=>{
            const  detailCourseId=detail.courseId.toString()
            console.log('Comparing:', { detailCourseId, courseId, status: detail.status });
           return detailCourseId === courseId && detail.status === 'active';
        })

         if(!coursePurchase){
            throw new BadRequestException('Course is not active or not found in payment record')
         }

         console.log('Purchase Date:', payment.purchaseDate);
         console.log('Current Time:', new Date());


         const purchaseTime=payment.purchaseDate
         const currentTime=new Date()
         const minuteSincePurchase=(currentTime.getTime()-purchaseTime.getTime())/(1000*60)


         if(minuteSincePurchase>30){
            throw new BadRequestException('Cancellation is not allowed after 30 minutes of purchase')
         }

         if(coursePurchase.status==='cancellation_pending'){
            throw new BadRequestException('Cancellation request is already pending')
         }

         const updatedPayment=await this.paymentRepository.updateCourseCancellationStatus(payment._id.toString(),courseId,reason)

         if(!updatedPayment){
            throw new BadRequestException('Failed to update cancellation status')
         }

         return updatedPayment
    }
}
