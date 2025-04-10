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

    async findAll():Promise<CategoryDocument[]>{
        return this.categoryModel.find().exec()
    }

    async findById(id:string):Promise<CategoryDocument>{
        const category=await this.categoryModel.findById(id)
        if(!category){
            throw new Error('Category not found')
        }
        return category
    }

    async findByName(name:string):Promise<CategoryDocument>{
          const category=await this.categoryModel.findOne({name}).exec()
          if(!category){
            throw new Error('Category not found')
          }
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
