import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICouponResponse, IStudentCouponService } from './interfaces/student-coupon.interface';
import { COUPON_REPOSITORY } from '../constants/constant';
import { ICouponRepository } from '../repository/interfaces/coupon.repository.interface';
import { CouponType } from '../schema/coupon.schema';
import { Types } from 'mongoose';

@Injectable()
export class StudentCouponService implements IStudentCouponService{
    constructor(@Inject(COUPON_REPOSITORY) private readonly couponRepository:ICouponRepository){}

    async getAvailableCoupons(amount:number):Promise<{coupons:ICouponResponse[]}>{
        const currentDate=new Date()
        const coupons=await this.couponRepository.findAvailableCoupons(amount,currentDate)

        return {
            coupons: coupons.map(coupon => ({
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                minPurchaseAmount: coupon.minPurchaseAmount,
                maxDiscountAmount: coupon.maxDiscountAmount,
                description: coupon.description
            }))
        }
    }


    async validateCoupon(code:string,amount:number){
        const coupon=await this.couponRepository.findByCode(code)

        if(!coupon){
            throw new NotFoundException('coupon not found')
        }

        if(!coupon.isActive){
            throw new BadRequestException('Coupon is not active')
        }

        if(coupon.expiryDate<new Date()){
            throw new BadRequestException('coupon has expired')
        }

        if(amount<coupon.minPurchaseAmount){
            throw new BadRequestException( `Minimum purchase amount of ${coupon.minPurchaseAmount} required`)
        }

        if(coupon.currentUses>=coupon.maxUses){
             throw new BadRequestException('Coupon usage limit is reached')
        }

        

        let discount:number

        if(coupon.type===CouponType.PERCENTAGE){
            discount=(amount*coupon.value)/100

            if(coupon.maxDiscountAmount){
                discount=Math.min(discount,coupon.maxDiscountAmount)
            }
        }else{
            discount=coupon.value
        }

       return {
        valid:true,
        discount,
        message:'Coupon is valid'
       }
    }


    async updateCouponUsage(couponId:string,userId:string):Promise<void>{
        if(!Types.ObjectId.isValid(couponId)){
            throw new BadRequestException('Invalid coupon ID')
        }

        const coupon=await this.couponRepository.findById(couponId)

        if(!coupon){
            throw new NotFoundException('coupon not found')
        }

        coupon.currentUses+=1

        if(!coupon.usedBy.includes(userId)){
            coupon.usedBy.push(userId)
        }

        await coupon.save()
    }
}
