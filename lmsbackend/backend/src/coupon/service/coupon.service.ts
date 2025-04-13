import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ICouponService } from './interfaces/coupon.service.interface';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { ICouponRepository } from '../repository/interfaces/coupon.repository.interface';
import { Coupon } from '../schema/coupon.schema';
import { updateCategoryDto } from 'src/category/dto/update-category.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { Types } from 'mongoose';
import { COUPON_REPOSITORY } from '../constants/constant';

@Injectable()
export class CouponService implements ICouponService {

    constructor (@Inject(COUPON_REPOSITORY) private readonly couponRepository:ICouponRepository){}

    async createCoupon(createCouponDto:CreateCouponDto):Promise<Coupon>{
        const existingCoupon=await this.couponRepository.findByCode(createCouponDto.code)
        if(existingCoupon){
            throw new ConflictException('Coupon code already exists')
        }
        return this.couponRepository.create(createCouponDto)
    }

    async getAllCoupons(page:number=1,limit:number=10){
        const result=await this.couponRepository.findAll(page,limit)
        return {
            coupons:result.coupons,
            pagination:{
                total:result.total,
                page:result.page,
                limit:result.limit,
                totalPages:result.totalPages
            }
        }
    }


    async getCouponById(id:string):Promise<Coupon>{
        return this.couponRepository.findById(id)
    }


    async updateCoupon(id:string,updateCouponDto:UpdateCouponDto):Promise<Coupon>{
        if(updateCouponDto.code){
            const existingCoupon=await this.couponRepository.findByCodeExcludingId(updateCouponDto.code,id)
            if(existingCoupon &&existingCoupon._id.toString() !==id){
                throw new ConflictException('Coupon code already exists')
            }

        }
        return this.couponRepository.update(id,updateCouponDto)
    }



    async deleteCoupon(id:string):Promise<Coupon>{
        return this.couponRepository.delete(id)
    }
    
}

