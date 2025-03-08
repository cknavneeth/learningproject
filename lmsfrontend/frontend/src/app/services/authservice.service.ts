import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';

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


  verifyotp(email:string,otp:string):Observable<any>{
    return this.http.post(`${this.apiurl}/verifyotp`,{email,otp})
  }

  login(userData:any):Observable<any>{
      return this.http.post(`${this.apiurl}/login`,userData,{withCredentials:true}).pipe(
        tap((response:any)=>{
          this.saveAccesstoken(response.accesstoken)
        })
      )
  }

  private accesstoken:string|null=null

  saveAccesstoken(token:string){
     this.accesstoken=token
  }

  refreshToken(){
    return this.http.post<{accesstoken:string}>(`${this.apiurl}/refreshtoken`,{},{withCredentials:true}).pipe(
      tap(response=>{
        this.saveAccesstoken(response.accesstoken)
      }),
      catchError(error=>{
        console.log(error)
        throw error
      })
    )
  }



}
