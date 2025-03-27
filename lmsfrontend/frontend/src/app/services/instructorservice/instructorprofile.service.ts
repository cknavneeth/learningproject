import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorprofileService {

  private apiurl='http://localhost:5000/auth/instructor';

  constructor(private http:HttpClient) { }

  //for getting student instructor profile
  getInstructorProfile():Observable<any>{
    return this.http.get<any>(`${this.apiurl}/profile`)
  }

  //for updating student instructor profile
  updateInstructorProfile(profileData:any):Observable<any>{
    return this.http.put(`${this.apiurl}/profile`,profileData)
  }

  //just update instructor password
  updateInstructorPassword(passwordData:any):Observable<any>{
    return this.http.put(`${this.apiurl}/changepassword`,passwordData)
  }
  

 
}
