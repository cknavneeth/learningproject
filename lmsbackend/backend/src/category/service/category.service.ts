import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICategoryRepository } from '../repository/interfaces/category.repository.interface';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Category } from '../schema/category.schema';
import { CATEGORY_REPOSITORY } from '../constants/constant';
import { ICategoryService } from './interfaces/category.service.interface';
import { updateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService implements ICategoryService{
    constructor(@Inject(CATEGORY_REPOSITORY) private readonly categoryRepository:ICategoryRepository){}


    async createCategory(createCategoryDto:CreateCategoryDto):Promise<Category>{
         const existingCategory=await this.categoryRepository.findByName(createCategoryDto.name)
         if(existingCategory){
            throw new ConflictException('Category already exists');
         }
         return this.categoryRepository.create(createCategoryDto)
    }

    async getAllCategories():Promise<Category[]>{
        return this.categoryRepository.findAll()
    }

    async getCategoryById(id:string):Promise<Category>{
        const category=await  this.categoryRepository.findById(id)
        if(!category){
            throw new NotFoundException('Category not found')
        }
        return category
    }

    async updateCategory(id:string,updateCategoryDto:updateCategoryDto):Promise<Category>{
        const category=await this.categoryRepository.update(id,updateCategoryDto)
        if(!category){
            throw new NotFoundException('Category not found')
        }
        return category
    }


    async deleteCategory(id:string):Promise<Category>{
        const category=await this.categoryRepository.delete(id)
        if(!category){
            throw new NotFoundException('Category not found')
        }
        return category
    }
}
