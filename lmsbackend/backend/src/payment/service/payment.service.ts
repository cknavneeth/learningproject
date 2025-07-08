import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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

import { ObjectId } from 'mongoose';
import { ICoursePurchase } from 'src/common/interfaces/payment.interface';
import { MESSAGES } from '@nestjs/core/constants';
import { ERROR_MESSAGES } from 'src/mylearning/constants/mylearning.constants';
import { MESSAGE } from 'src/common/constants/messages.constants';
import { InternalServerError } from 'openai';
import { NotFoundError } from 'rxjs';
import { UserRepository } from 'src/users/repositories/user/user.repository';

import { v4 as uuidv4 } from 'uuid';
import { CartRepository } from 'src/cart/repositories/cart/cart.repository';
import { TransactionType } from 'src/users/users.schema';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { InstructorPayoutDto } from '../dto/instructor-payout.dto';
import { Payout, payoutDocument } from '../schema/payout.schema';
import { PayoutDetailsResponse, PayoutResponse } from 'src/common/interfaces/payoutRequest.interface';
import { InstructorPayoutRequestDto } from '../dto/instructorpayout-request.dto';
import { InstructorRepository } from 'src/instructors/repositories/instructor/instructor.repository';
import axios from 'axios';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { PayoutDetails } from '../dto/payoutDetailsRes.dto';



@Injectable()
export class PaymentService implements IPaymentService {
  private readonly logger = new Logger(PaymentService.name);

  private razorpay: Razorpay;

  private redis: Redis;

  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    private configService: ConfigService,
    private userRepository: UserRepository,
    private cartRepository: CartRepository,
    private instructorRepository: InstructorRepository,
    @InjectRedis() redis: Redis,
  ) {
    const key_id = this.configService.get<string>('RAZORPAY_KEY_ID');
    const key_secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (!key_id || !key_secret) {
      throw new Error(
        'RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be provided',
      );
    }

    this.razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    this.redis = redis;
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    console.log('Received order request:', createOrderDto);

    //setting up redis for distributed locking system
    const userId = createOrderDto.userId;
    const lockKey = `lock:user:${userId}:checkout`;

    const isLocked = await this.redis.get(lockKey);
    if (isLocked) {
      throw new ConflictException(
        'Checkout is already active ,try after some time',
      );
    }

    await this.redis.set(lockKey, 'locked', 'EX', 600);
    try {
      const order = await this.razorpay.orders.create({
        amount: createOrderDto.amount,
        currency: createOrderDto.currency,
        receipt: `order_${Date.now()}`,
      });
      console.log('Razorpay order created:', order);

      try {
        const amountInRupees = createOrderDto.amount / 100;
        const courseIds = createOrderDto.items
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id));

        console.log('Course IDs being saved:', courseIds);

        const userId = createOrderDto.userId;
        if (!userId) {
          throw new BadRequestException('User ID is required');
        }

        //pre -check for already exist
        const purchased = await this.paymentRepository.findPurchased(
          userId,
          courseIds,
        );

        const alreadyPurchasedCourses = new Set(
          purchased.map((p) => p.courseId),
        );

        const conflictedCourses = courseIds.filter((courseId) =>
          alreadyPurchasedCourses.has(courseId),
        );

        if (conflictedCourses.length > 0) {
          this.logger.log('conflicting courses are here', conflictedCourses);
          throw new ConflictException(
            `You already purchased following courses ${conflictedCourses.map((item) => item.toString()).join(',')}`,
          );
        }
        //pre check for already exist

        const payment = await this.paymentRepository.create({
          orderId: order.id,
          amount: amountInRupees,
          currency: order.currency,
          status: 'pending',
          coursesDetails: courseIds.map((courseId) => ({
            courseId,
            amount: amountInRupees,
            status: 'active',
          })), // Add items to track what's being purchased
          userId: new Types.ObjectId(userId),
        });
        console.log('Payment record created:', payment);
      } catch (dbError) {
        console.error('Failed to create payment record:', dbError);
      }

      // 3. Return order details
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: 'created',
      };
    } catch (error) {
      console.error('Order creation error:', {
        message: error.message,
        stack: error.stack,
        details: error.response?.data,
      });

      //my little update to check dupes
      if (error?.code === 11000 || error.message.includes('E11000')) {
        throw new BadRequestException('The Course is already purchased');
      }
      throw new BadRequestException(`Failed to create order: ${error.message}`);
    }
  }

  async verifyPayment(
    verifyPaymentDto: VerifyPaymentDto,
  ): Promise<Payment | null> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      verifyPaymentDto;

    console.log('Verifying payment with data:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    const key_secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (!key_secret) {
      throw new Error('RAZORPAY_KEY_SECRET must be provided');
    }

    // 1. Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', key_secret)
      .update(sign.toString())
      .digest('hex');

    console.log('Signature verification:', {
      generated: expectedSign,
      received: razorpay_signature,
    });

    if (expectedSign !== razorpay_signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    try {
      // Find the original payment record first
      const originalPayment =
        await this.paymentRepository.findByOrderId(razorpay_order_id);
      if (!originalPayment) {
        throw new BadRequestException('No payment record found for this order');
      }

      // 2. Update payment status
      const payment = await this.paymentRepository.updatePaymentStatus(
        razorpay_order_id,
        'completed',
        razorpay_payment_id,
      );

      //gonna delete redis here
      await this.redis.del(`lock:user:${originalPayment.userId}:checkout`);

      //gonna save data to my coursePurchased schema

      try {
        for (let courseDetail of originalPayment.coursesDetails) {
          let newDoc: ICoursePurchase = {
            userId: new Types.ObjectId(originalPayment.userId),
            courseId: new Types.ObjectId(courseDetail.courseId),
            paymentId: new Types.ObjectId(originalPayment._id),
            purchasedDate: new Date(),
          };

          const savingDoc =
            await this.paymentRepository.coursepurchaseSave(newDoc);
          this.logger.log(savingDoc);
        }
      } catch (error) {
        console.error('Inner catch error:', error);
        console.error('Inner catch error code:', error?.code);
        console.error('Inner catch error message:', error?.message);

        if (error?.code === 11000 || error?.message?.includes('E11000')) {
          throw new BadRequestException(MESSAGE.PAYMENT.ALREADY_PURCHASED);
        }

        throw new BadRequestException('Something occured in wrong');
      }

      //saving ends here

      if (!payment) {
        this.logger.log('payment update avathond puthiyath indakam');

        const paymentDetails =
          await this.razorpay.payments.fetch(razorpay_payment_id);
        const newPayment = await this.paymentRepository.create({
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          amount: paymentDetails.amount / 100,
          currency: paymentDetails.currency,
          status: 'completed',
          userId: originalPayment.userId,
          coursesDetails: originalPayment.coursesDetails,
        });
        return newPayment;
      }

      return payment;
    } catch (error) {
      console.error('Payment verification error:', error);
      console.error('outer catch', error.message);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to verify payment');
    }
  }

  async getPaymentHistory(userId: string) {
    return this.paymentRepository.findByUserId(userId);
  }

  async requestCourseCancellation(
    userId: string,
    courseId: string,
    reason: string,
  ): Promise<Payment> {
    console.log(
      'hello requestilek kerunnundo testing hnyy',
      userId,
      courseId,
      reason,
    );
    const payment = await this.paymentRepository.findLatestPaymentByCourse(
      userId,
      courseId,
    );

    console.log('Found payment:', payment);

    if (!payment) {
      throw new BadRequestException('No payment record found for this course');
    }

    console.log(
      'CourseDetails:',
      payment.coursesDetails.map((detail) => ({
        courseId: detail.courseId.toString(),
        status: detail.status,
      })),
    );

    const coursePurchase = payment.coursesDetails.find((detail) => {
      const detailCourseId = detail.courseId.toString();
      console.log('Comparing:', {
        detailCourseId,
        courseId,
        status: detail.status,
      });
      return detailCourseId === courseId && detail.status === 'active';
    });

    if (!coursePurchase) {
      throw new BadRequestException(
        'Course is not active or not found in payment record',
      );
    }

    console.log('Purchase Date:', payment.purchaseDate);
    console.log('Current Time:', new Date());

    const purchaseTime = payment.purchaseDate;
    const currentTime = new Date();
    const minuteSincePurchase =
      (currentTime.getTime() - purchaseTime.getTime()) / (1000 * 60);

    if (minuteSincePurchase > 30) {
      throw new BadRequestException(
        'Cancellation is not allowed after 30 minutes of purchase',
      );
    }

    if (coursePurchase.status === 'cancellation_pending') {
      throw new BadRequestException('Cancellation request is already pending');
    }

    const updatedPayment =
      await this.paymentRepository.updateCourseCancellationStatus(
        payment._id.toString(),
        courseId,
        reason,
      );

    if (!updatedPayment) {
      throw new BadRequestException('Failed to update cancellation status');
    }

    return updatedPayment;
  }

  //gonna pay using wallet

  async payusingWallet(createOrderDto: CreateOrderDto, userId: string) {
    try {
      this.logger.log('entered to wallet service');
      const user = await this.userRepository.findById(
        createOrderDto?.userId || userId,
      );
      if (!user) {
        throw new NotFoundException(MESSAGE.USER.NOT_FOUND);
      }
      this.logger.log('wallet user', user);
      if (user.wallet < createOrderDto.amount) {
        this.logger.log('no enough money');
        throw new BadRequestException(MESSAGE.WALLET.NOT_ENOUGH);
      }

      const orderId = `WALLET-ORDER-${uuidv4()}`;
      const paymentId = `WALLET-TXN-${uuidv4()}`;

      const paymentSaving = await this.paymentRepository.createwalletPay(
        createOrderDto,
        userId,
        orderId,
        paymentId,
      );

      if (!paymentSaving) {
        this.logger.log('No payment found');
        throw new Error('No payment found');
      }
      this.logger.log('wallet paymentSaving', paymentSaving);
      user.wallet -= createOrderDto.amount;

      user.transactions.push({
        type: TransactionType.DEBIT,
        amount: createOrderDto.amount,
        date: new Date(),
        description: `money debited for ${orderId}`,
      });

      await user.save();

      const cartofUser = await this.cartRepository.findUserById(userId);
      if (!cartofUser) {
        throw new Error('No cart found for this user');
      }
      cartofUser.items = [];
      await cartofUser.save();

      return { success: true, message: 'wallet payment done' };
    } catch (error) {
      this.logger.error('Wallet Payment Error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error?.message || MESSAGE.PAYMENT.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //creating payout for the instructor here hurray
  async createPayout(
    instructorPayoutDto: InstructorPayoutDto,
    instructorId: string,
  ): Promise<payoutDocument | null> {
    try {
      const creatingPayout = await this.paymentRepository.createPayoutSchema(
        instructorPayoutDto,
        instructorId,
      );
      if (!creatingPayout) {
        throw new NotFoundException('Payout not found');
      }
      return creatingPayout;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error?.message || MESSAGE.PAYMENT.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //payout response
  async makePayout(
    instructorPayoutRequestDto: InstructorPayoutRequestDto,
    instructorId: string,
  ): Promise<PayoutResponse> {
    try {
      let instructor = await this.instructorRepository.findById(instructorId);

      if (!instructor) {
        throw new NotFoundException(MESSAGE.INSTRUCTOR.NOT_FOUND);
      }


      //Date validation
      let now=new Date()

      let nextEligibleDate=new Date(instructor.lastPayoutDate)

      nextEligibleDate.setMonth(nextEligibleDate.getMonth()+1)

      if(now < nextEligibleDate){
        throw new BadRequestException(`you can make payout monthly once!next date is ${nextEligibleDate.toDateString()}`)
      }

      let todayDay=now.getDate()
      if(todayDay<1 || todayDay >10){
        throw new BadRequestException(`withdrawals are allowd only in 1 to 10`)
      }


      const totalEarnings=instructor.totalEarnings??0
      const totalwithDrawn=instructor.totalwithDrawn??0
      
        let availableBalance =totalEarnings-totalwithDrawn

          if(availableBalance<10000){
            throw new BadRequestException(`Minimum threshold is 10000`)
          }

        if (availableBalance < instructorPayoutRequestDto.amount) {
          throw new BadRequestException(MESSAGE.INSTRUCTOR.NOT_ENOUGH_MONEY);
        }
      

      //WE have to check instructor filled the form or not ? payoutschema is there
      let payoutforInstructor = await this.paymentRepository.findInstructorPayout(instructorId);

      if (!payoutforInstructor) {
        throw new NotFoundException('Payout record not found! Fill payout form');
      }

      let razorpayContactId = payoutforInstructor.razorpayContactId;
      let razorpayFundAccountId = payoutforInstructor.razorpayFundAccountId;

      if (!razorpayContactId) {
        const contacts = await axios.post(
          'https://api.razorpay.com/v1/contacts',
          {
            name: payoutforInstructor.name,
            email: payoutforInstructor.email,
            // phone: payoutforInstructor.phone,
            type: 'vendor',
          },
          {
            auth: {
              username: this.configService.get<string>('RAZORPAY_KEY_ID')!,
              password: this.configService.get<string>('RAZORPAY_KEY_SECRET')!,
            },
          },
        );

        razorpayContactId = contacts.data.id;
        payoutforInstructor.razorpayContactId = razorpayContactId;
      }

      if (!razorpayFundAccountId) {
        let funcdAccountId=await axios.post(
          'https://api.razorpay.com/v1/fund_accounts',
          {
            contact_id: razorpayContactId,
            account_type: 'bank_account',
            bank_account: {
              name: payoutforInstructor.accountHolderName || payoutforInstructor.name,
              ifsc: payoutforInstructor.ifsc,
              account_number: payoutforInstructor.accountNumber,
            },
          },
          {
            auth: {
              username: process.env.RAZORPAY_KEY_ID!,
              password: process.env.RAZORPAY_KEY_SECRET!,
            },
          },
        );

        razorpayFundAccountId=funcdAccountId.data.id
        payoutforInstructor.razorpayFundAccountId=razorpayFundAccountId
      }

      await payoutforInstructor.save()

       //now lets create the payout
       const payout = await axios.post(
  'https://api.razorpay.com/v1/payouts',
  {
    account_number: this.configService.get<string>('RAZORPAY_ACCOUNT_NUMBER'),
    fund_account_id: razorpayFundAccountId,
    amount: instructorPayoutRequestDto.amount * 100,
    currency: 'INR',
    mode: 'IMPS',
    purpose: 'payout',
    queue_if_low_balance: true,
  },
  {
    auth: {
      username: this.configService.get<string>('RAZORPAY_KEY_ID')!,
      password: this.configService.get<string>('RAZORPAY_KEY_SECRET')!,
    },
  },
);

   const obj={
      instructorId:instructor._id,
      amount:instructorPayoutRequestDto.amount,
      razorpayPayoutId:payout.data.id,
      status:payout.data.status
   }

   let payoutSuccessSave=await this.paymentRepository.payoutSuccessSave(obj)

   instructor.lastPayoutDate=new Date()
   
   instructor.totalwithDrawn=instructor.totalwithDrawn+instructorPayoutRequestDto.amount
   await instructor.save()

   return{
       success:true,
       message:'Payout initiated',
       payoutId:payout.data.id,
       status:payout.data.status
   }

    } catch (error) {
        console.log('💥 Error during payout:', error?.response?.data || error);
        if(error instanceof HttpException){
          throw error
        }
        throw new InternalServerErrorException(error.message||MESSAGE.PAYMENT.INTERNAL_SERVER_ERROR)
    }

  }



  async updatePayout(updateData: Partial<InstructorPayoutDto>,instructorId:string): Promise<{message:string}> {
      try {
         const payout=await this.paymentRepository.findInstructorPayout(instructorId)

         if(!payout){
          throw new NotFoundException('No payout record found.lplease fill payout details first.')
         }

         const bankChanged=payout.ifsc!==updateData.ifsc||payout.accountNumber!==updateData.accountNumber

         payout.name=updateData.name||payout.name
         payout.email=updateData.email||payout.email
         payout.phone=updateData.phone||payout.phone
         payout.accountHolderName=updateData.accountHolderName||payout.accountHolderName
         payout.ifsc=updateData.ifsc||payout.ifsc
         payout.accountNumber=updateData.accountNumber||payout.accountNumber

         if(payout.razorpayContactId){
             const updateContact=await axios.patch(
               `https://api.razorpay.com/v1/contacts/${payout.razorpayContactId}`,
              {
                 name:payout.name,
                 email:payout.email,
                 type:'vendor'
              },
              {
                  auth:{
                    username:this.configService.get<string>('RAZORPAY_KEY_ID')!,
                    password:this.configService.get<string>('RAZORPAY_KEY_SECRET')!
                  }
              }
             )

         }else{
            const contact=await axios.post(
              'https://api.razorpay.com/v1/contacts',
              {
                  name:payout.name,
                  email:payout.email,
                  type:'vendor'
              },
              {
                auth:{
                    username:this.configService.get<string>('RAZORPAY_KEY_ID')!,
                    password:this.configService.get<string>('RAZORPAY_KEY_SECRET')!
                }

              }
            )
            payout.razorpayContactId=contact.data.id
         }

         

         if(bankChanged){
            const funcAccountId=await axios.post(
              'https://api.razorpay.com/v1/fund_accounts',
              {
                  contact_id:payout.razorpayContactId,
                  account_type:'bank_account',
                  bank_account:{
                    name:payout.accountHolderName||payout.name,
                    ifsc:payout.ifsc,
                    account_number:payout.accountNumber
                  },
              },
              {
                   auth: {
                         username: this.configService.get<string>('RAZORPAY_KEY_ID')!,
                         password: this.configService.get<string>('RAZORPAY_KEY_SECRET')!,
                   },
              }
            )

            payout.razorpayFundAccountId=funcAccountId.data.id
         }

         await payout.save()

         return {message:'Payout Edited!keep rockin'}
      } catch (error) {
          if(error instanceof HttpException){
           throw error
          }
          throw new InternalServerErrorException(error.message||MESSAGE.PAYMENT.INTERNAL_SERVER_ERROR)
      }


  }



   async getPayoutDetails(instructorId:string):Promise<PayoutDetailsResponse>{
    try {

        const instructorPayout=await this.paymentRepository.findInstructorPayout(instructorId)
        if(!instructorPayout){
          throw new NotFoundException(MESSAGE.INSTRUCTOR.NOT_FOUND)
        }

        const mappedPayout=plainToInstance(
           PayoutDetails,
           instructorPayout.toObject()
        )
        return mappedPayout

    } catch (error) {
       if(error instanceof HttpException){
        throw error
       }
       throw new InternalServerErrorException(error.message||MESSAGE.PAYMENT.INTERNAL_SERVER_ERROR)
    }
   }


}
