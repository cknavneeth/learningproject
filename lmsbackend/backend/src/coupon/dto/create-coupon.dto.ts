import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateIf } from "class-validator";
import { CouponType } from "../schema/coupon.schema";
import { Type } from 'class-transformer';

export class CreateCouponDto{
    @IsNotEmpty()
    @IsString()
    code:string


    @IsNotEmpty()
    @IsEnum(CouponType)
    type:CouponType

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(100,{message:'For percentage type,value must be between 0 and 100'})
    value:number

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    maxUses:number

    @IsNotEmpty()
    @Type(()=>Date)
    @IsDate()
    expiryDate:Date

    @IsOptional()
    @IsString()
    description?:string

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    minPurchaseAmount:number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @ValidateIf((o) => o.minPurchaseAmount > o.maxDiscountAmount, {
        message: 'Maximum discount amount must be less than minimum purchase amount'
    })
    maxDiscountAmount?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

}