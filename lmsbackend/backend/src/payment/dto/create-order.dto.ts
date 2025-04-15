import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateOrderDto{
    @IsNotEmpty()
    @IsNumber()
    @Min(100)
    @Max(10000000)
    amount:number


    
    @IsString()
    currency:string

    
    @IsArray()
    items:string[]

    @IsOptional()
    @IsString()
    coupon?:string


    @IsNotEmpty()
    @IsString()
    userId?: string
}