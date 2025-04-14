import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { STUDENT_COUPON_SERVICE } from '../constants/constant';
import { IStudentCouponService } from '../service/interfaces/student-coupon.interface';

@Controller('student/coupons')
export class StudentCouponController {
    constructor(@Inject(STUDENT_COUPON_SERVICE) private readonly studentCouponService:IStudentCouponService){}

    @Get('available')
    async getAvailableCoupons(@Query('amount') amount:number){
        return this.studentCouponService.getAvailableCoupons(amount)
    }

    @Post('validate')
    async validateCoupon(
          @Body() data:{code:string; amount:number}
    ){

        return this.studentCouponService.validateCoupon(data.code,data.amount)
    }
}
