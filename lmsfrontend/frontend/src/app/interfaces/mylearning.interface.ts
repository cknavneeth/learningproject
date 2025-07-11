export interface EnrolledCourse{
    _id:string;
    title:string;
    price:number;
    thumbnailUrl:string;
    instructor:{
        name:string
    };
    progress:number;
    hasReviewed:boolean;
    status?: 'active' | 'cancelled' | 'cancellation_pending';
    purchaseDate: Date;
}

export interface UpdateProgressRequest {
    sectionId: string;
    progress: number;
    timestamp?: number;
  }



  export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetEnrolledCoursesResponse {
  courses: EnrolledCourse[];
  pagination: Pagination;
}
  