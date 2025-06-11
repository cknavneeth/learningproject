export interface Certificate{
    _id?:string;
    userId:string
    courseId:string
    courseName:string
    completionDate:Date
    certificateUrl:string
    createdAt?:Date
    updatedAt?:Date
}


export interface CertificateResponse{
    message:string
    certificate:Certificate
}


export interface CertificatePagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CertificatesListResponse {
  certificates: Certificate[];
  pagination: CertificatePagination;
}


export interface GenerateCertificateRequest {
  courseId: string;
  completionDate: Date;
}