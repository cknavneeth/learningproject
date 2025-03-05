import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  private apiurl='http://localhost:5000/auth';

  constructor(private http:HttpClient) { }

  register(userData:any):Observable<any>{
    return this.http.post(`${this.apiurl}/register`,userData)
  }

  sendOtp(email:string):Observable<any>{
    return this.http.post(`${this.apiurl}/sendotp`,{email},{headers:{'Content-Type':'application/json'}})
  }
}
