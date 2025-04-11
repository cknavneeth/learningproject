import { CreateCategoryDto } from "src/category/dto/create-category.dto";
import { updateCategoryDto } from "src/category/dto/update-category.dto";
import { Category } from "src/category/schema/category.schema";

export interface ICategoryService{
    createCategory(createCategoryDto:CreateCategoryDto):Promise<Category>
    getAllCategories(page?:number,limit?:number):Promise<{
       categories: Category[],
       pagination:{
        total:number,
        page:number,
        limit:number,
        totalPages:number
       }
    }>
    getCategoryById(id:string):Promise<Category>
    updateCategory(id:string,updateCategoryDto:updateCategoryDto):Promise<Category>
    deleteCategory(id:string):Promise<Category>
}