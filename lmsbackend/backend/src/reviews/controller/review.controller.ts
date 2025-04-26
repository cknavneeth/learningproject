import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { IReviewService } from '../service/interfaces/review.service.interface';
import { REVIEW_SERVICE } from '../constants/review.constant';
import { GuardGuard } from 'src/authentication/guard/guard.guard';
import { CreateReviewDto } from '../Dto/create-review.dto';
import { UpdateReviewDto } from '../Dto/update-review.dto';

@Controller('review')
export class ReviewController {
    constructor(
        @Inject(REVIEW_SERVICE) private readonly reviewService:IReviewService
    ){}

    @Post('course/:courseId')
    @UseGuards(GuardGuard)
    async createReview(
        @Req() req,
        @Param('courseId') courseId:string,
        @Body() createReviewDto:CreateReviewDto
     ){
        const userId=req.user.userId
        const result=await this.reviewService.createReview(userId,courseId,createReviewDto)
    }


    @Get('course/:courseId')
    async getReviewsByCourse(@Param('courseId') courseId:string){
          return this.reviewService.getReviewsByCourse(courseId)
    }


    @Put(':reviewId')
    @UseGuards(GuardGuard)
    async updateReview(
        @Req() req,
        @Param('reviewId') reviewId:string,
        @Body() updateReviewDto:UpdateReviewDto
    ){

        const userId=req.user.userId
        return this.reviewService.updateReview(reviewId,userId,updateReviewDto)

    }



    @Delete(':reviewId')
    @UseGuards(GuardGuard)
    async deleteReview(
        @Req() req,
        @Param('reviewId') reviewId:string
    ){
        const userId=req.user.userId
        return this.reviewService.deleteReview(reviewId,userId)
    }
}

