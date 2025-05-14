export interface Review {
    _id: string;
    userId: string;
    courseId: string;
    rating: number;
    comment: string;
    username?: string;
    createdAt: Date;
    updatedAt: Date;
    isEdited?: boolean;
    instructorReply?: string;
    hasInstructorReply?: boolean;
    instructorReplyDate?: Date;
  }

export interface CreateReviewDto{
    rating:number;
    comment:string;
}

export interface UpdateReviewDto{
    rating?:number;
    comment?:string;
}