import { BadRequestException, Body, Controller, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PAYMENT_SERVICE } from '../constants/payment-constant';
import { IPaymentService } from '../service/interfaces/payment.service.interface';
import { CreateOrderDto } from '../dto/create-order.dto';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';
import { GuardGuard } from 'src/authentication/guard/guard.guard';

@Controller('student/payment')
export class PaymentController {
    constructor(@Inject(PAYMENT_SERVICE) private readonly paymentService:IPaymentService){}

    @Post('create-order')
    @UseGuards(GuardGuard)
    async createOrder(@Body() createOrderDto:CreateOrderDto,@Req() req){
        createOrderDto.userId=req.user.userId
         return this.paymentService.createOrder(createOrderDto)
    }

    @Post('verify-payment')
    async verifyPayment(@Body() verifyPaymentDto:VerifyPaymentDto){
        return this.paymentService.verifyPayment(verifyPaymentDto)
    }

    @Get('history')
    @UseGuards(GuardGuard)
    async getPaymentHistory(@Req() req){
        const userId=req.user.userId
        return this.paymentService.getPaymentHistory(userId)
    }


    @Post('cancel/:courseId')
    @UseGuards(GuardGuard)
    async requestCancellation(
        @Param('courseId') courseId:string,
        @Body('reason') reason:string,
        @Req() req
    ){

        if(!reason){
            throw new BadRequestException('cancellation reason is required')
        }

        const userId=req.user.userId

        return this.paymentService.requestCourseCancellation(userId,courseId,reason)

    }


}
