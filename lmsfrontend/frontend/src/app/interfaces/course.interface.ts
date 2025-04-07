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