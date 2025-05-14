import { CreateReviewDto } from "src/reviews/Dto/create-review.dto";
import { InstructorReplyDto } from "src/reviews/Dto/instructor-reply.dto";
import { Review } from "src/reviews/schema/review.schema";

export interface IReviewService{

   createReview(userId:string,courseId:string,createReviewDto:CreateReviewDto):Promise<CreateReviewDto>
   updateReview(reviewId:string,userId:string,data:Partial<Review>):Promise<Review|null>
   deleteReview(reviewId:string,userId:string):Promise<Review|null>
   getReviewsByCourse(courseId: string): Promise<Review[]>;
   getUserReviewForCourse(courseId:string,userId:string):Promise<Review|null>
   addInstructorReply(reviewId:string,instructorId:string,replyDto:InstructorReplyDto):Promise<Review|null>
}