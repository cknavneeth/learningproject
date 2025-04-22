export interface SalesHistory{
    _id:string,
    orderId:string,
    courses:Array<{
        _id:string,
        title:string,
        price:number
    }>
    totalAmount:number,
    purchaseDate:Date,
    status:'completed'|'pending'|'cancelled'|'refund_requested',
    student:{
        name:string,
        email:string
    }
    cancellationReason?:string
}