import { Review } from "src/reviews/schema/review.schema";

export interface IReviewRepository{
    create(data:Partial<Review>):Promise<Review>
    findById(id:string):Promise<Review>
    findByUserAndCourse(userId:string,courseId:string):Promise<Review|null>
    findByCourse(courseId:string):Promise<Review[]>
    update(id:string,data:Partial<Review>):Promise<Review|null>
    delete(reviewId:string,userId:string):Promise<Review|null>
    findUserReviewForCourse(courseId:string,userId:string):Promise<Review|null>
    addInstructorReply(reviewId:string,instructorReply:string):Promise<Review|null>
}