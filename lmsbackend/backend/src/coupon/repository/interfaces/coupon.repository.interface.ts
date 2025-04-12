import { CreateCouponDto } from "src/coupon/dto/create-coupon.dto";
import { UpdateCouponDto } from "src/coupon/dto/update-coupon.dto";
import { CouponDocument } from "src/coupon/schema/coupon.schema";

export interface ICouponRepository{
    create(createCouponDto:CreateCouponDto):Promise<CouponDocument>

    findAll(page:number,limit:number):Promise<{
        coupons:CouponDocument[];
        total:number
        page:number
        limit:number
        totalPages:number
    }>

    findById(id:string):Promise<CouponDocument>

    update(id:string,updateCouponDto:UpdateCouponDto):Promise<CouponDocument>

    delete(id:string):Promise<CouponDocument>

    findByCode(code:string):Promise<CouponDocument|null>
}