import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateReviewDto{
    @IsNumber()
    @Min(1)
    @Max(5)
    rating:number


    @IsString()
    @IsNotEmpty()
    comment:string
}