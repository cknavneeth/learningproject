import { Injectable, Logger } from '@nestjs/common';
import { IReviewRepository } from './interfaces/review.repository.interface';
import { Review, ReviewDocument } from '../schema/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ReviewRepository implements IReviewRepository{
    private readonly logger=new Logger(ReviewRepository.name)
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



    async findUserReviewForCourse(courseId: string, userId: string): Promise<Review|null> {
        try {
            return await this.reviewModel.findOne({
                courseId:new Types.ObjectId(courseId),
                userId:new Types.ObjectId(userId)
            }).lean()
        } catch (error) {
            this.logger.error(`Error finding user review: ${error.message}`);
            throw error;
        }
    }


    async addInstructorReply(reviewId: string, instructorReply: string): Promise<Review | null> {
        try {
            const review=await this.reviewModel.findByIdAndUpdate(reviewId,
                {
                    instructorReply,
                    hasInstructorReply:true,
                    instructorReplyDate:new Date()
                },
                {new : true}
            ).exec()

            return review
        } catch (error) {
            throw error
        }
    }
}
