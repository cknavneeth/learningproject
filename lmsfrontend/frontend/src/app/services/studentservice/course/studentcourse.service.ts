import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class StudentcourseService {

  private apiUrl = 'http://localhost:5000/auth/student';

  constructor(private http:HttpClient) { }

  getAllCourses():Observable<any>{
    console.log('Making API request to:', `${this.apiUrl}/courses`);
    return this.http.get(`${this.apiUrl}/courses`)
  }


  getCourseById(courseId:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/courses/${courseId}`,{})
  }
}
