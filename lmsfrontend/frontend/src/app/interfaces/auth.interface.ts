export interface AdminLoginResponse{
    accesstoken:string;
    message:string
}
export interface students{
    _id:string
    id?:string
    username: string;
    email: string;
    isBlocked: boolean;
    isVerified: boolean;
}
export interface instructors{
    _id:string
    id?:string
    name:string
    emailaddress:string
    isBlocked:boolean
    isVerified:boolean
    isApproved:boolean
    certificateUrl:string
}

export interface OtpVerificationData{
    email?:string,
    emailaddress?:string,
    otp:string
}