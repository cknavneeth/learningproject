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

  verifyInstructor(instructorId:string,isApproved:boolean):Observable<instructors>{
        return this.http.patch<instructors>(`${this.apiurl}/verifyinstructor/${instructorId}`,{isApproved})
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
