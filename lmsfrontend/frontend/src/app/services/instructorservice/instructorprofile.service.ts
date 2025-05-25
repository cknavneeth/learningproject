import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, InstructorProfile, PasswordUpdateRequest, ProfileUpdateRequest } from '../../interfaces/instructorprofile.interface';

@Injectable({
  providedIn: 'root'
})
export class InstructorprofileService {

  // private apiurl='http://localhost:5000/auth/instructor';
  private apiurl=`${environment.apiUrl}/auth/instructor`

  constructor(private http:HttpClient) { }

  //for getting student instructor profile
  getInstructorProfile():Observable<InstructorProfile>{
    console.log('getting instructor profile')
    return this.http.get<InstructorProfile>(`${this.apiurl}/profile`)
  }

  //for updating student instructor profile
  updateInstructorProfile(profileData:ProfileUpdateRequest):Observable<ApiResponse>{
    return this.http.put<ApiResponse>(`${this.apiurl}/profile`,profileData)
  }

  //just update instructor password
  updateInstructorPassword(passwordData:PasswordUpdateRequest):Observable<ApiResponse>{
    return this.http.put<ApiResponse>(`${this.apiurl}/changepassword`,passwordData)
  }

  reapplyAsInstructor():Observable<ApiResponse>{
    return this.http.post<ApiResponse>(`${this.apiurl}/reapply`,{})
  }
  

 
}
