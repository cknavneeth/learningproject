export interface Course {
    _id?: string;
    title: string;
    description: string;
    price: number;
    thumbnail?: string;
    status: 'draft' | 'published';
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