import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { IReviewService } from '../service/interfaces/review.service.interface';
import { REVIEW_SERVICE } from '../constants/review.constant';
import { GuardGuard } from 'src/authentication/guard/guard.guard';
import { CreateReviewDto } from '../Dto/create-review.dto';
import { UpdateReviewDto } from '../Dto/update-review.dto';
import { InstructorReplyDto } from '../Dto/instructor-reply.dto';

@Controller('review')
export class ReviewController {
    constructor(
        @Inject(REVIEW_SERVICE) private readonly _reviewService:IReviewService
    ){}

    @Post('course/:courseId')
    @UseGuards(GuardGuard)
    async createReview(
        @Req() req,
        @Param('courseId') courseId:string,
        @Body() createReviewDto:CreateReviewDto
     ){
        const userId=req.user.userId
        const result=await this._reviewService.createReview(userId,courseId,createReviewDto)
    }


    @Get('course/:courseId')
    async getReviewsByCourse(@Param('courseId') courseId:string){
          return this._reviewService.getReviewsByCourse(courseId)
    }


    @Put(':reviewId')
    @UseGuards(GuardGuard)
    async updateReview(
        @Req() req,
        @Param('reviewId') reviewId:string,
        @Body() updateReviewDto:UpdateReviewDto
    ){

        const userId=req.user.userId
        return this._reviewService.updateReview(reviewId,userId,updateReviewDto)

    }



    @Delete(':reviewId')
    @UseGuards(GuardGuard)
    async deleteReview(
        @Req() req,
        @Param('reviewId') reviewId:string
    ){
        const userId=req.user.userId
        return this._reviewService.deleteReview(reviewId,userId)
    }


    @Get('course/:courseId/user-review')
    @UseGuards(GuardGuard)
    async getUserReviewForCourse(
        @Param('courseId') courseId:string,
        @Req() req
    ){
        const userId=req.user.userId
        return this._reviewService.getUserReviewForCourse(courseId,userId)
    }


    @Post(':reviewId/instructor-reply')
    @UseGuards(GuardGuard)
    async addInstructorReply(
        @Req() req,
        @Param('reviewId') reviewId:string,
        @Body() replyDto:InstructorReplyDto
    ){
        const instructorId=req.user.InstructorId
        return this._reviewService.addInstructorReply(reviewId,instructorId,replyDto)
    }
}

