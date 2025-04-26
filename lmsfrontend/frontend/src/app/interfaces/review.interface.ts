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
  }

export interface CreateReviewDto{
    rating:number;
    comment:string;
}

export interface UpdateReviewDto{
    rating?:number;
    comment?:string;
}