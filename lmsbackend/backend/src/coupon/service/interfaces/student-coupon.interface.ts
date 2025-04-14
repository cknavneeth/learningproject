import { Coupon, CouponType } from "../../schema/coupon.schema";


export interface ICouponResponse {
    code: string;
    type: CouponType;
    value: number;
    minPurchaseAmount: number;
    maxDiscountAmount?: number;
    description?: string;
}

export interface IStudentCouponService {
    getAvailableCoupons(amount: number): Promise<{
        coupons: ICouponResponse[];
    }>;
    validateCoupon(code: string, amount: number): Promise<{
        valid: boolean;
        discount?: number;
        message?: string;
    }>;
}