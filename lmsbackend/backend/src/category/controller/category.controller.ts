import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ICategoryService } from '../service/interfaces/category.service.interface';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CATEGORY_SERVICE } from '../constants/constant';
import { updateCategoryDto } from '../dto/update-category.dto';

@Controller('category')
export class CategoryController {
    constructor(@Inject(CATEGORY_SERVICE) private readonly categoryService:ICategoryService){}

    @Post()
    async createCategory(@Body() createCategoryDto:CreateCategoryDto){
        return this.categoryService.createCategory(createCategoryDto)
    }

   
    @Get()
    async getAllCategories(){
        return this.categoryService.getAllCategories()
    }


    @Get()
    async getCategoryById(@Param('id') id:string){
        return this.categoryService.getCategoryById(id)
    }

    @Put(':id')
    async updateCategory(@Param('id') id:string,@Body() updateCategoryDto:updateCategoryDto ){
       return this.categoryService.updateCategory(id,updateCategoryDto)
    }

    @Delete(':id')
    async deleteCategory(@Param('id') id:string){
        return this.categoryService.deleteCategory(id)
    }

}
