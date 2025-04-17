import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class UpdateProgressDto{
    @IsString()
    sectionId:string

    @IsNumber()
    @Min(0)
    @Max(100)
    progress:number

    @IsNumber()
    @IsOptional()
    timestamp?:number
}