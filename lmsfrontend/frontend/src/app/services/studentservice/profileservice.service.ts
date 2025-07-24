import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile, ProfileResponse, UserProfile } from '../../interfaces/userprofile.interface';



@Injectable({
  providedIn: 'root'
})
export class ProfileserviceService {

  // private apiurl='http://localhost:5000/auth/student';
  private apiurl=`${environment.apiUrl}/auth/student`

  constructor(private http:HttpClient) { }

  getStudentProfile():Observable<UserProfile>{
    return this.http.get<UserProfile>(`${this.apiurl}/profile`)
  }


  updateStudentProfile(profileData:any):Observable<ProfileResponse>{
    return this.http.put<ProfileResponse>(`${this.apiurl}/profile`,profileData)
  }

  updateStudentPassword(passwordData:any):Observable<Profile>{
    return this.http.put<Profile>(`${this.apiurl}/changepassword`,passwordData)
  }
}
