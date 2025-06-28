import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IReviewService } from './interfaces/review.service.interface';
import { IReviewRepository } from '../repository/interfaces/review.repository.interface';
import { REVIEW_REPOSITORY } from '../constants/review.constant';
import { Review } from '../schema/review.schema';
import { UpdateReviewDto } from '../Dto/update-review.dto';
import { CourseProgress, CourseProgressDocument } from 'src/mylearning/schema/course-progress.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InstructorReplyDto } from '../Dto/instructor-reply.dto';

@Injectable()
export class ReviewService implements IReviewService{

    private readonly logger=new Logger(ReviewService.name)

    constructor(@Inject(REVIEW_REPOSITORY) private readonly _reviewRepository:IReviewRepository,
    @InjectModel(CourseProgress.name) private progressModel:Model<CourseProgressDocument>
){}

    async createReview(userId:string,courseId:string,createReviewDto):Promise<Review>{

          const existingReview=await this._reviewRepository.findByUserAndCourse(userId,courseId)
          if(existingReview){
            throw new Error('User has already reviewed this course')
          }

          await this.progressModel.findOneAndUpdate(
            {userId:new Types.ObjectId(userId),courseId:new Types.ObjectId(courseId)},
            {hasReviewed:true}
            
          )

          return this._reviewRepository.create({
            userId,
            courseId,
            ...createReviewDto
          })
    }


    async getReviewsByCourse(courseId:string):Promise<Review[]>{
       const reviews=await this._reviewRepository.findByCourse(courseId)

       return reviews.map(review => {
        const reviewObj = review as any;  
        return {
            _id: review._id,
            userId: review.userId,
            courseId: review.courseId,
            rating: review.rating,
            comment: review.comment,
            username: reviewObj.userId?.username || 'Unknown',
            createdAt: reviewObj.createdAt,
            updatedAt: reviewObj.updatedAt,
            isEdited: reviewObj.updatedAt && reviewObj.createdAt && 
                     reviewObj.updatedAt.getTime() !== reviewObj.createdAt.getTime(),
            instructorReply:reviewObj.instructorReply,
            hasInstructorReply:reviewObj.hasInstructorReply,
            instructorReplyDate:reviewObj.instructorReplyDate

        };
    });
    }


    async updateReview(reviewId:string,userId:string,updateReviewDto:UpdateReviewDto):Promise<Review|null>{
        const review=await this._reviewRepository.findById(reviewId)

        if(!review){
            throw new Error('Review not found')
        }

        if(review.userId.toString()!==userId){
            throw new UnauthorizedException('You can only edit your own review')
        }

        return this._reviewRepository.update(reviewId,{
            ...updateReviewDto,
            isEdited:true
        })
    }


    async deleteReview(reviewId:string,userId:string):Promise<Review|null>{
        const review =await this._reviewRepository.findById(reviewId)
        if(!review){
            throw new Error('Review not found')
        }
        if(review.userId.toString()!==userId){
            throw new UnauthorizedException('You can only delete your own review')
        }
        return this._reviewRepository.delete(reviewId,userId)
    }



    async getUserReviewForCourse(courseId: string, userId: string): Promise<Review | null> {
        try {
            const review=await this._reviewRepository.findUserReviewForCourse(courseId,userId)
            if(!review){
                return null
            }
            return review
        } catch (error) {
            this.logger.error(`Error getting user review for course: ${error.message}`);
            throw new InternalServerErrorException('Failed to get user review');
        }
    }




    async addInstructorReply(reviewId:string,instructorId:string,replyDto:InstructorReplyDto):Promise<Review|null>{
        try {
            const review=await this._reviewRepository.findById(reviewId)
            if(!review){
                throw new NotFoundException('Review not found')
            }

            return this._reviewRepository.addInstructorReply(reviewId,replyDto.instructorReply)
        } catch (error) {
             this.logger.error(`Error adding instructor reply: ${error.message}`);
             if (error instanceof NotFoundException) {
                throw error;
             }
            throw new InternalServerErrorException('Failed to add instructor reply');
        }
    }
}
