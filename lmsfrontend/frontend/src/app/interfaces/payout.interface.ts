export interface payoutData{
    name:string,
    email:string,
    phone?:string,
    ifsc:string,
    accountNumber:string,
    accountHolderName?:string
}



export interface PayoutResponse{
    success:boolean,
    message:string,
    payoutId:string,
    status:string
}