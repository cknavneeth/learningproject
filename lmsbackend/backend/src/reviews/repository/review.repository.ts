import { Injectable } from '@nestjs/common';
import { IReviewRepository } from './interfaces/review.repository.interface';
import { Review, ReviewDocument } from '../schema/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReviewRepository implements IReviewRepository{
    constructor(@InjectModel(Review.name) private reviewModel:Model<ReviewDocument>){}

    async create(data:Partial<Review>):Promise<Review>{
        const review=new this.reviewModel(data)
        return review.save()
    }

    async findById(id:string):Promise<Review>{
        const review=await this.reviewModel.findById(id).exec()
        if(!review){
            throw new Error('Review not found')
        }
        return review
    }


    async findByUserAndCourse(userId:string,courseId:string):Promise<Review|null>{
        return this.reviewModel.findOne({userId,courseId}).exec()
    }


    async update(id:string,data:Partial<Review>):Promise<Review|null>{
        return this.reviewModel.findByIdAndUpdate(id,data,{new:true}).exec()
    }

    async delete(id:string):Promise<Review|null>{
        return this.reviewModel.findByIdAndDelete(id).exec()
    }

    async findByCourse(courseId: string): Promise<Review[]> {
        return this.reviewModel
            .find({ courseId })
            .populate('userId', 'username')
            .sort({ createdAt: -1 })
            .exec();
    }
}
