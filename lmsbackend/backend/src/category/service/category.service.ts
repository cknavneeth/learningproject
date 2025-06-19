import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICategoryRepository } from '../repository/interfaces/category.repository.interface';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Category } from '../schema/category.schema';
import { CATEGORY_REPOSITORY } from '../constants/constant';
import { ICategoryService } from './interfaces/category.service.interface';
import { updateCategoryDto } from '../dto/update-category.dto';
import items from 'razorpay/dist/types/items';
import { plainToInstance } from 'class-transformer';
import { ResponseCategoryDto } from '../dto/response-category.dto';

@Injectable()
export class CategoryService implements ICategoryService{
    constructor(@Inject(CATEGORY_REPOSITORY) private readonly _categoryRepository:ICategoryRepository){}

    private logger=new Logger()


    async createCategory(createCategoryDto:CreateCategoryDto):Promise<Category>{
         const existingCategory=await this._categoryRepository.findByName(createCategoryDto.name)
         if(existingCategory){
            throw new ConflictException('Category already exists');
         }
         return this._categoryRepository.create(createCategoryDto)
    }

    async getAllCategories(page:number=1,limit:number=10):Promise<{
        categories:ResponseCategoryDto[],
        pagination:{
            total:number,
            page:number,
            limit:number,
            totalPages:number
        }
    }>{
        const result=await this._categoryRepository.findAll(page,limit)

        this.logger.log('just checking categories for admin',result.categories)

        
       const mappedObject=plainToInstance(
        ResponseCategoryDto,
        result.categories.map((item)=>({
          _id:item._id?.toString()||'',
          name:item.name,
          description:item.description,
          
        })
        )
      )
        

        
        return {
            categories:mappedObject,
            pagination:{
                total:result.total,
                page:result.page,
                limit:result.limit,
                totalPages:result.totalPages
            }
        } 
    }

    async getCategoryById(id:string):Promise<Category>{
        const category=await  this._categoryRepository.findById(id)
        if(!category){
            throw new NotFoundException('Category not found')
        }

        return category
    }

    async updateCategory(id:string,updateCategoryDto:updateCategoryDto):Promise<Category>{
        const category=await this._categoryRepository.update(id,updateCategoryDto)
        if(!category){
            throw new NotFoundException('Category not found')
        }
        return category
    }


    async deleteCategory(id:string):Promise<Category>{
        const category=await this._categoryRepository.delete(id)
        if(!category){
            throw new NotFoundException('Category not found')
        }
        return category
    }
}
