import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileserviceService {

  private apiurl='http://localhost:5000/auth/student';

  constructor(private http:HttpClient) { }

  getStudentProfile():Observable<any>{
    return this.http.get<any>(`${this.apiurl}/profile`)
  }


  updateStudentProfile(profileData:any):Observable<any>{
    return this.http.put(`${this.apiurl}/profile`,profileData)
  }

  updateStudentPassword(passwordData:any):Observable<any>{
    return this.http.put(`${this.apiurl}/changepassword`,passwordData)
  }
}
