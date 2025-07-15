import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminLoginResponse, instructors } from '../interfaces/auth.interface';
import { Observable, tap, catchError } from 'rxjs';
import { students } from '../interfaces/auth.interface';
import { TokenserviceService } from './tokenservice.service';
import { Router } from '@angular/router';
import { SalesHistory } from '../interfaces/saleshistory.interface';
import { DashboardStats } from '../interfaces/dashboard.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminserviceService {

  constructor(private http:HttpClient,private tokenService:TokenserviceService,private router:Router) { }

  // private apiurl='http://localhost:5000/auth/admin';
  private apiurl=`${environment.apiUrl}/auth/admin`

  adminloginform(adminData:any):Observable<AdminLoginResponse>{
    return this.http.post<AdminLoginResponse>(`${this.apiurl}/login`,adminData)
    .pipe(
      tap(response=>{
        if(response.accesstoken){
          this.tokenService.setToken(response.accesstoken)
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
        this.tokenService.removeToken();
      })
    );
  }


  addCourseOffer(courseId: string, offerData: { percentage: number; discountPrice: number }): Observable<any> {
    return this.http.post<any>(`${this.apiurl}/courses/${courseId}/offer`, offerData);
  }

  removeCourseOffer(courseId: string): Observable<any> {
    return this.http.delete(`${this.apiurl}/courses/${courseId}/offer`);
  }


 

  approveRefund(params: { orderId: string, courseId: string }): Observable<any> {
    return this.http.patch(`${this.apiurl}/refund/${params.orderId}/${params.courseId}/approve`, {});
  }

  getSalesHistory(page: number = 1, limit: number = 10): Observable<{
    sales: SalesHistory[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  }> {
    return this.http.get<{
      sales: SalesHistory[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }
    }>(`${this.apiurl}/sales-history?page=${page}&limit=${limit}`);
  }



  //for getting dashboard for admin
  getDashboarStats():Observable<DashboardStats>{
    return this.http.get<DashboardStats>(`${this.apiurl}/dashboard/stats`)
  }
}



