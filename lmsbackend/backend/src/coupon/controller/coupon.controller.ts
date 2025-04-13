import { Body, Controller, DefaultValuePipe, Delete, Get, Inject, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ICouponService } from '../service/interfaces/coupon.service.interface';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { COUPON_SERVICE } from '../constants/constant';

@Controller('admin/coupon')
export class CouponController {
     
    constructor(@Inject(COUPON_SERVICE) private readonly couponService:ICouponService){}

    @Post()
    async createCoupon(@Body() createCouponDto:CreateCouponDto){
        return this.couponService.createCoupon(createCouponDto)
    }

    @Get()
    async getAllCoupons(
         @Query('page',new DefaultValuePipe(1),ParseIntPipe) page:number,
         @Query('limit',new DefaultValuePipe(10),ParseIntPipe) limit:number
    ){
          return this.couponService.getAllCoupons(page,limit)
    }

    @Put(':id')
    async updateCoupon(
        @Param('id') id:string,
        @Body() updateCouponDto:UpdateCouponDto
    ){
        return this.couponService.updateCoupon(id,updateCouponDto)
    }

    @Delete(':id')
    async deleteCoupon(
        @Param('id') id:string
    ){
        return this.couponService.deleteCoupon(id)
    }


    @Get(':id')
    async getCouponById(@Param('id') id:string){
        return this.couponService.getCouponById(id)
    }
}
