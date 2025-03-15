import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminLoginResponse, instructors } from '../interfaces/auth.interface';
import { Observable } from 'rxjs';
import { students } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminserviceService {

  constructor(private http:HttpClient) { }

  private apiurl='http://localhost:5000/auth/admin';

  adminloginform(adminData:any):Observable<AdminLoginResponse>{
    return this.http.post<AdminLoginResponse>(`${this.apiurl}/login`,adminData)
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

}
