import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminLoginResponse, instructors } from '../interfaces/auth.interface';
import { Observable, tap } from 'rxjs';
import { students } from '../interfaces/auth.interface';
import { TokenserviceService } from './tokenservice.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminserviceService {

  constructor(private http:HttpClient,private tokenService:TokenserviceService,private router:Router) { }

  private apiurl='http://localhost:5000/auth/admin';

  adminloginform(adminData:any):Observable<AdminLoginResponse>{
    return this.http.post<AdminLoginResponse>(`${this.apiurl}/login`,adminData)
    .pipe(
      tap(response=>{
        if(response.accesstoken){
          this.tokenService.setAdminToken(response.accesstoken)
        }
      })
    )
  }

  fetchstudents():Observable<students[]>{
    return this.http.get<students[]>(`${this.apiurl}/students`)
  }

  toggleBlockStatus(studentId:string):Observable<students>{
    return this.http.patch<students>(`${this.apiurl}/toggleblock/${studentId}`,{})
  }

  fetchInstructors():Observable<instructors[]>{
     return this.http.get<instructors[]>(`${this.apiurl}/instructors`)
  }

  toggleblockInstructor(instructorId:string):Observable<instructors>{
      return this.http.patch<instructors>(`${this.apiurl}/blockinstructor/${instructorId}`, {})
  }

  verifyInstructor(instructorId:string,isApproved:boolean,feedback?:string):Observable<instructors>{
        return this.http.patch<instructors>(`${this.apiurl}/verifyinstructor/${instructorId}`,{isApproved,feedback})
  }

  getAllCourses(page: number = 1, limit: number = 10) {
    const url = `${this.apiurl}/admin/courses`;
    console.log('Calling API:', url);
    return this.http.get<{
      courses: any[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }
    }>(`${this.apiurl}/courses?page=${page}&limit=${limit}`);
  }

  approveCourse(courseId:string):Observable<any>{
    return this.http.patch<any>(`${this.apiurl}/courses/${courseId}/approve`,{})

  }

  rejectCourse(courseId:string,feedback:string):Observable<any>{
    return this.http.patch<any>(`${this.apiurl}/courses/${courseId}/reject`,{feedback})
  }

  logoutAdmin(): Observable<any> {
    // Remove router navigation from service
    return this.http.post(`${this.apiurl}/logout`, {}).pipe(
      tap(() => {
        this.tokenService.removeAdminToken();
      })
    );
  }

}
