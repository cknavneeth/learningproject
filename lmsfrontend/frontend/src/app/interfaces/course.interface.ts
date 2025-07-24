import { Review } from "./review.interface";

// export interface Course {
//     _id?: string;
//     title: string;
//     description: string;
//     price: number;
//     thumbnailUrl?: string;
//     status: 'draft' | 'published'|'rejected'|'pending_review';
//     sections: CourseSection[];
//     createdAt?: Date;
//     updatedAt?: Date;
//   }

  export interface CourseSection {
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    order: number;
    resources: Resource[];
  }

  
export interface Resource {
    title: string;
    fileUrl: string;
    fileType: string;
  }

  export interface CourseResponse {
    courses: Course[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}


export interface CourseFilters {
  search?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  languages?: string[];
  levels?: string[];
  page?: number;
  limit?: number;
}

// export type CourseStatus='pending_review' | 'published' | 'rejected' |'draft'

export interface StatusClasses{
  [key:string]:string,
  pending_review:string,
  published:string,  
  rejected:string
}


export interface VideoUploadResponse{
  videoUrl:string
}

export interface ThumbnailUploadResponse{
  thumbnailUrl:string
}

export interface ResourceUploadResponse{
  fileUrl:string
}

export interface CourseCreateRequest{
  title: string;
  description: string;
  price: number;
  category: string;
  duration: number;
  courseTopic: string;
  courseLanguage: string;
  courseLevel: string;
  thumbnailUrl?: string;
  courseRequirements?: string[];
  targetAudience?: string[];
  learningOutcomes?: string[];
  sections: CourseSection[];
  isDraft: boolean;
}


export interface InstructorCourseDetails{
  _id:string,
  title:string,
  description:string
  price: number;
  category: string;
  duration: number;
  courseTopic: string;
  courseLanguage: string;
  courseLevel: string;
  thumbnailUrl?: string;
  courseRequirements?: string[];
  targetAudience?: string[];
  learningOutcomes?: string[];
  sections: CourseSection[];
  instructor: string;
  status: 'draft' | 'published' | 'rejected' | 'pending_review';
  feedback?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnrolledStudentsResponse{
  students:EnrolledStudent[],
  pagination:{
    total:number,
    page:number
    limit:number
    totalPages:number
  }
}

export interface EnrolledStudent {
  studentId: string;
  name: string;
  email: string;
  totalPurchases: number;
  lastPurchaseDate: string; 
  courses: {
    courseId: string;
    title: string;
    price: number;
  }[];
}


 export interface BackendFullResponse {
      status: string;
      data: EnrolledStudentsResponse; // This 'data' property holds what your EnrolledStudentsResponse describes
    }



export interface CourseDetails {
  _id: string;
  title: string;
  description: string;
  instructorId: string;
  price: number;
  isPublished: boolean;
  thumbnailUrl: string;
  videoUrls: string[];
  resourceUrls: string[];
  createdAt: string;
  updatedAt: string;
}


export interface DraftCourse extends Course {
  isDraft: boolean;
}


export interface PaginatedResponse<T> {
  data: {
    courses: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}



export interface CourseDetailsResponse {
  course: Course;
  stats: {
    totalEnrollments: number;
    completionRate: number;
    revenue: number;
    lastEnrollment: Date | null;
    enrollmentTrend: number[];
    revenueTrend: number[];
    monthLabels: string[];
  };
  reviews: Review[]; // De
}



export type CourseStatus = 'published' | 'rejected' | 'pending_review'





export interface Course {
  _id: string;
  title: string;
  category: string;
  duration: number;
  description: string;
  price: number;
  courseTopic: string;
  courseLanguage: string;
  courseLevel: string;
  thumbnailUrl?: string;
  courseRequirements?: string[];
  targetAudience?: string[];
  learningOutcomes?: string[];
  sections?: Section[];
  instructor: string;
  status: CourseStatus; // or CourseStatus enum
  feedback?: string;
  approvedAt?: Date;
  offer?: {
    percentage: number;
    discountPrice: number;
    createdAt: Date;
  };
}

export interface Section {
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  resources: {
    title: string;
    fileUrl: string;
    fileType: string;
  }[];
}

