import { CreateCategoryDto } from "./create-category.dto";
import { PartialType } from '@nestjs/mapped-types';

export class updateCategoryDto extends PartialType(CreateCategoryDto){

}