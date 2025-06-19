import { Body, Controller, DefaultValuePipe, Delete, Get, Inject, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ICategoryService } from '../service/interfaces/category.service.interface';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CATEGORY_SERVICE } from '../constants/constant';
import { updateCategoryDto } from '../dto/update-category.dto';

@Controller('admin/category')
export class CategoryController {
    constructor(@Inject(CATEGORY_SERVICE) private readonly _categoryService:ICategoryService){}

    @Post()
    async createCategory(@Body() createCategoryDto:CreateCategoryDto){
        return this._categoryService.createCategory(createCategoryDto)
    }

   
    @Get()
    async getAllCategories(
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page:number,
        @Query('limit',new DefaultValuePipe(10),ParseIntPipe) limit:number
    ){
        return this._categoryService.getAllCategories(page,limit)
    }


    @Get()
    async getCategoryById(@Param('id') id:string){
        return this._categoryService.getCategoryById(id)
    }

    @Put(':id')
    async updateCategory(@Param('id') id:string,@Body() updateCategoryDto:updateCategoryDto ){
       return this._categoryService.updateCategory(id,updateCategoryDto)
    }

    @Delete(':id')
    async deleteCategory(@Param('id') id:string){
        return this._categoryService.deleteCategory(id)
    }

}
