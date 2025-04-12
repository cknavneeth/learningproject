import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, CouponDocument } from '../schema/coupon.schema';
import { Model, Types } from 'mongoose';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { ICouponRepository } from './interfaces/coupon.repository.interface';

@Injectable()
export class CouponRepository implements ICouponRepository{
    constructor(@InjectModel(Coupon.name) private couponModel:Model<CouponDocument>){}

    async create(createCouponDto:CreateCouponDto):Promise<CouponDocument>{
        const coupon=new this.couponModel(createCouponDto)
        return coupon.save()
    }

    async findAll(page:number=1,limit:number=10){
        const skip=(page-1)*limit

        const [coupons,total]=await Promise.all([
            this.couponModel.find()
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .exec(),
            this.couponModel.countDocuments()
        ])

        return {
            coupons,
            total,
            page,
            limit,
            totalPages:Math.ceil(total/limit)
        }
    }


    async findById(id:string):Promise<CouponDocument>{
          if(!Types.ObjectId.isValid(id)){
            throw new NotFoundException('Invalid coupon id')
          }

          const coupon =await this.couponModel.findById(id)
          if(!coupon){
            throw new NotFoundException('Coupon not found')
          }
          return coupon
    }


    async update(id:string,updateCouponDto:UpdateCouponDto):Promise<CouponDocument>{
        if(!Types.ObjectId.isValid(id)){
            throw new NotFoundException('Invalid coupon id')
        }

        const coupon=await this.couponModel.findByIdAndUpdate(
            id,
            {$set:updateCouponDto},
            {new:true,runValidators:true}
        )

        if(!coupon){
            throw new NotFoundException('coupon not found')
        }
        return coupon
    }


    async delete(id:string):Promise<CouponDocument>{
        if(!Types.ObjectId.isValid(id)){
            throw new NotFoundException('Invalid coupon id')
        }
        const coupon=await this.couponModel.findByIdAndDelete(id)
        if(!coupon){
            throw new NotFoundException('coupon not found')
        }
        return coupon
    }


    async findByCode(code:string):Promise<CouponDocument|null>{
        return this.couponModel.findOne({code})
    }


}
