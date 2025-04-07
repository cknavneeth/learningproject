import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course, CourseResponse } from '../../../interfaces/course.interface';





@Injectable({
  providedIn: 'root'
})
export class StudentcourseService {

  private apiUrl = 'http://localhost:5000/auth/student';

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
    console.log('Making API request to:', `${this.apiUrl}/courses`);
    return this.http.get<CourseResponse>(`${this.apiUrl}/courses`,{params})
  }


  getCourseById(courseId:string):Observable<Course>{
    return this.http.get<Course>(`${this.apiUrl}/courses/${courseId}`,{})
  }
}
