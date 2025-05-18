import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Course, CourseResponse } from '../../../interfaces/course.interface';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { UpdateProgressRequest } from '../../../interfaces/mylearning.interface';
import { environment } from '../../../../environments/environment';





@Injectable({
  providedIn: 'root'
})
export class StudentcourseService {

  // private apiUrl = 'http://localhost:5000/auth/student';
  // private baseUrl = 'http://localhost:5000';
  private baseUrl=environment.apiUrl
  private authStudentUrl = `${this.baseUrl}/auth/student`; // For UsersController endpoints
  private learningUrl = `${this.baseUrl}/auth/student/learning`; 



  constructor(private http:HttpClient) { }
  getAllCourses(params: any): Observable<CourseResponse> {
    // Convert the params object to HttpParams
    let httpParams = new HttpParams();
    
    // Add all parameters to HttpParams
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    
    console.log('HTTP params being sent:', httpParams.toString());
    
    // Make the API call with the params
    return this.http.get<CourseResponse>(`${this.authStudentUrl}/courses`, { params: httpParams });
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



  requestCourseCancellation(courseId: string, reason: string): Observable<any> {
    // Update to correct endpoint: student/payment/cancel/:courseId
    return this.http.post(`${this.baseUrl}/student/payment/cancel/${courseId}`, { reason })
        .pipe(
            catchError((error) => {
                console.error('API Error:', error);
                return throwError(() => error);
            })
        );
  }


  
}
