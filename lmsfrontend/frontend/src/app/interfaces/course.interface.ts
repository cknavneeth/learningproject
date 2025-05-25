export interface Course {
    _id?: string;
    title: string;
    description: string;
    price: number;
    thumbnail?: string;
    status: 'draft' | 'published'|'rejected'|'pending_review';
    sections: CourseSection[];
    createdAt?: Date;
    updatedAt?: Date;
  }

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

export type CourseStatus='pending_review' | 'published' | 'rejected' |'draft'

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

export interface EnrolledStudent{
  _id:string
  username:string
  email:string
  enrolledAt:Date
  progress:number
}


