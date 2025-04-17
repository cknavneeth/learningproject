import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Course, CourseResponse } from '../../../interfaces/course.interface';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { UpdateProgressRequest } from '../../../interfaces/mylearning.interface';





@Injectable({
  providedIn: 'root'
})
export class StudentcourseService {

  // private apiUrl = 'http://localhost:5000/auth/student';
  private baseUrl = 'http://localhost:5000';
  private authStudentUrl = `${this.baseUrl}/auth/student`; // For UsersController endpoints
  private learningUrl = `${this.baseUrl}/auth/student/learning`; 



  constructor(private http:HttpClient) { }

  getAllCourses(filters:{
    search?: string,
        minPrice?: number,
        maxPrice?: number,
        languages?: string[],
        levels?: string[],
        page?: number,
        limit?: number
  }):Observable<CourseResponse>{
    let params = new HttpParams();
    if (filters.minPrice !== undefined) {
      params = params.set('minPrice', filters.minPrice.toString());
  }
  if (filters.maxPrice !== undefined) {
      params = params.set('maxPrice', filters.maxPrice.toString());
  }
  if (filters.languages?.length) {
      params = params.set('languages', filters.languages.join(','));
  }
  if (filters.levels?.length) {
      params = params.set('levels', filters.levels.join(','));
  }
  if (filters.page) {
      params = params.set('page', filters.page.toString());
  }
  if (filters.limit) {
      params = params.set('limit', filters.limit.toString());
  }
    console.log('Making API request to:', `${this.authStudentUrl}/courses`);
    return this.http.get<CourseResponse>(`${this.authStudentUrl}/courses`,{params})
  }


  getCourseById(courseId:string):Observable<Course>{
    return this.http.get<Course>(`${this.authStudentUrl}/courses/${courseId}`,{})
  }


  getEnrolledCourses(page: number = 1, limit: number = 6): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
      
    return this.http.get(`${this.learningUrl}`, { params });
}


  getEnrolledCourseDetails(courseId:string):Observable<any>{
    console.log('ingot ethaninda')
    return this.http.get(`${this.learningUrl}/course/${courseId}`)
    .pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  updateCourseProgress(courseId:string,data:UpdateProgressRequest):Observable<any>{
    return this.http.put(`${this.learningUrl}/course/${courseId}/progress`,data)
  }

  downloadResource(courseId: string, resourceId: string): Observable<any> {
    return this.http.get(`${this.learningUrl}/course/${courseId}/resources/${resourceId}/download`, {
        responseType: 'blob',
        observe: 'response'
    }).pipe(
        map(response => {
            const contentDisposition = response.headers.get('content-disposition');
            const fileName = contentDisposition ? 
                contentDisposition.split(';')[1].split('=')[1].replace(/"/g, '') : 
                'download';
            
            const blob = response.body;
            if (!blob) {
                throw new Error('No content received');
            }
            
            const url = window.URL.createObjectURL(blob);
            
            return { fileUrl: url, fileName: fileName };
        })
    );
  }


  getCourseProgress(courseId: string): Observable<any> {
    return this.http.get(`${this.learningUrl}/course/${courseId}/progress`);
  }
}
