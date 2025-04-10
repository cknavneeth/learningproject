import { IsNotEmpty, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
   @IsNotEmpty()
   @IsString()
   @MinLength(3)
   name:string

   @IsOptional()
   @IsString()
   description?:string

   @IsOptional()
   @IsBoolean()
   isActive?:boolean
}


