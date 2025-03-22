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
    rejectionFeedback?:string
    canReapply?:boolean
    rejectedAt?:Date
}

export interface OtpVerificationData{
    email?:string,
    emailaddress?:string,
    otp:string
}


export interface UserCredentials{
    emailaddress?:string,
    email?:string,
    password:string
}

export interface RegisterData extends UserCredentials{
    username:string
}

export interface authResponse {
    accesstoken?:string,
    refreshtoken?:string,
    message:string
}

export interface otpResponse{
    message:string
}

export interface forgotpasswordResponse{
    message:string
}

export interface resetpasswordResponse{
    message:string
}

