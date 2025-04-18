import { CreateCategoryDto } from "src/category/dto/create-category.dto";
import { Category } from "src/category/schema/category.schema";
import { updateCategoryDto } from "src/category/dto/update-category.dto";

export interface ICategoryRepository{
    create(createCategoryDto:CreateCategoryDto):Promise<Category>
    findAll(page:number,limit:number):Promise<{
       categories: Category[],
       total:number,
       page:number,
       limit:number,
       totalPages:number
    }>
    findById(id:string):Promise<Category>
    update(id:string,updateCategoryDto:updateCategoryDto):Promise<Category>
    delete(id:string):Promise<Category>
    findByName(name:string):Promise<Category|null>
}