export interface EnrolledCourse{
    _id:string;
    title:string;
    price:number;
    thumbnailUrl:string;
    instructor:{
        name:string
    };
    progress:number;
}

export interface UpdateProgressRequest {
    sectionId: string;
    progress: number;
    timestamp?: number;
  }
  