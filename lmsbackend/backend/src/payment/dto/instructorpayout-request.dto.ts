import { IsNotEmpty, IsNumber, isNumber, Min, min } from "class-validator";


export class InstructorPayoutRequestDto{

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    amount:number

    
}