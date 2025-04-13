import { CreateCouponDto } from "src/coupon/dto/create-coupon.dto";
import { UpdateCouponDto } from "src/coupon/dto/update-coupon.dto";
import { Coupon, CouponDocument } from "src/coupon/schema/coupon.schema";

export interface ICouponService{
    createCoupon(createCouponDto:CreateCouponDto):Promise<Coupon>
    getAllCoupons(page?:number,limit?:number):Promise<{
        coupons:Coupon[];
        pagination:{
            total:number
            page:number
            limit:number
            totalPages:number
        }
    }>

    getCouponById(id:string):Promise<Coupon>
    updateCoupon(id:string,updateCouponDto:UpdateCouponDto):Promise<Coupon>
    deleteCoupon(id:string):Promise<Coupon>
    
}