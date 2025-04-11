import { Body, Controller, DefaultValuePipe, Delete, Get, Inject, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ICategoryService } from '../service/interfaces/category.service.interface';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CATEGORY_SERVICE } from '../constants/constant';
import { updateCategoryDto } from '../dto/update-category.dto';

@Controller('admin/category')
export class CategoryController {
    constructor(@Inject(CATEGORY_SERVICE) private readonly categoryService:ICategoryService){}

    @Post()
    async createCategory(@Body() createCategoryDto:CreateCategoryDto){
        return this.categoryService.createCategory(createCategoryDto)
    }

   
    @Get()
    async getAllCategories(
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page:number,
        @Query('limit',new DefaultValuePipe(10),ParseIntPipe) limit:number
    ){
        return this.categoryService.getAllCategories(page,limit)
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
