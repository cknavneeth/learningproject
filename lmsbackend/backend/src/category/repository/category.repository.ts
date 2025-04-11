import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schema/category.schema';
import { ICategoryRepository } from './interfaces/category.repository.interface';
import { updateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryRepository implements ICategoryRepository{
    constructor(@InjectModel(Category.name) private categoryModel:Model<CategoryDocument> ){}

    async create(createCategoryDto:Partial<Category>):Promise<CategoryDocument>{
        const category=new this.categoryModel(createCategoryDto)
        return category.save()
    }

    async findAll(page:number=1,limit:number=10):Promise<{
       categories: CategoryDocument[],
       total:number,
       page:number,
       limit:number,
       totalPages:number

    }>{
        const skip=(page-1)*limit

        const [categories,total]=await Promise.all([
            this.categoryModel.find()
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .exec(),
            this.categoryModel.countDocuments().exec()
        ])
        return {
            categories,
            total,
            page,
            limit,
            totalPages:Math.ceil(total/limit)
        }
    }

    async findById(id:string):Promise<CategoryDocument>{
        const category=await this.categoryModel.findById(id)
        if(!category){
            throw new Error('Category not found')
        }
        return category
    }

    async findByName(name:string):Promise<CategoryDocument|null>{
          const category=await this.categoryModel.findOne({name}).exec()
          return category
    }

    async update(id:string,updateCategoryDto:updateCategoryDto):Promise<Category>{
        const category=await this.categoryModel.findByIdAndUpdate(id,{$set:updateCategoryDto},{new:true}).exec()
        if(!category){
            throw new Error('Category not found')
        }
        return category
    }

    async delete(id:string):Promise<Category>{
         const category=await this.categoryModel.findByIdAndDelete(id)
         if(!category){
            throw new Error('Category not found')   
         }
         return category
    }
}
