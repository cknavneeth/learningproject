import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { TokenserviceService } from './tokenservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  private apiurl='http://localhost:5000/auth/student';

  constructor(private http:HttpClient,private tokenservice:TokenserviceService) { }

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
          this.tokenservice.setStudentToken(response.accesstoken)
        })
      )
  }

  private accesstoken:string|null=null

  saveAccesstoken(token:string){
     this.accesstoken=token
  }

  getAccessToken():string|null{
    return this.tokenservice.getStudentToken()
  }

  refreshToken(){
    return this.http.post<{accesstoken:string}>(`${this.apiurl}/refreshtoken`,{},{withCredentials:true}).pipe(
      tap(response=>{
        this.saveAccesstoken(response.accesstoken)
        this.tokenservice.setStudentToken(response.accesstoken)
      }),
      catchError(error=>{
        console.log(error)
        this.tokenservice.removeStudentToken()
        throw error
      })
    )
  }


  logoutthestudent():Observable<any>{
    return this.http.post(`${this.apiurl}/logout`,{},{withCredentials:true}).pipe(
      tap(()=>{
        this.tokenservice.removeStudentToken()
      }),
      catchError((error)=>{
        throw error
      })
    )
  }


  forgotpassword(email:string):Observable<any>{
    return this.http.post(`${this.apiurl}/forgotpassword`,{email})
  }

  resetpassword(token:string,password:string):Observable<any>{
    return this.http.post(`${this.apiurl}/resetpassword/${token}`,{password})
  }



  
}
