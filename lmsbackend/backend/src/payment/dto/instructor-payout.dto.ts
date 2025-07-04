import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";


export class InstructorPayoutDto{

    @IsNotEmpty()
    @IsString()
    name:string

    @IsOptional()
    @IsEmail()
    email:string

    @IsOptional()
    @IsPhoneNumber('IN')
    phone?:string

    @IsNotEmpty()
    @IsNotEmpty()
    @Length(6,11)
    ifsc:string

    @IsNotEmpty()
    @IsString()
    accountNumber:string

    @IsOptional()
    @IsString()
    accountHolderName?:string

}