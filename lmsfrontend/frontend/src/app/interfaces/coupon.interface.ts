export interface Coupon{
    _id:string;
    code:string,
    type:'percentage'|'fixed'

    value:number
    maxUses:number
    currentUses?:number
    minPurchaseAmount?:number
    maxDiscountAmount?:number
    expiryDate:Date
    description?:string
    isActive:boolean
    createdAt:Date
    updatedAt:Date
}

export interface CouponResponse{
    coupons:Coupon[],
    pagination:{
        total:number;
        page:number
        limit:number
        totalPages:number
    }
}


export interface CouponCreateDto{
    code:string,
    type:'percentage'|'fixed'
    value:number
    maxUses:number
    minPurchaseAmount?:number
    maxDiscountAmount?:number
    expiryDate:Date
    description?:string
    isActive:boolean
}

export interface CouponUpdateDto{
    code?:string
    type?:'percentage'|'fixed'
    value?:number
    maxUses?:number
    minPurchaseAmount?:number
    maxDiscountAmount?:number
    expiryDate?:Date
    description?:string
    isActive?:boolean
}


export interface ValidateCouponResponse{
    valid:boolean
    discount?:number
    message?:string
}