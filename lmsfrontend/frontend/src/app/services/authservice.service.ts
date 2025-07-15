import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { TokenserviceService } from './tokenservice.service';
import { authResponse, forgotpasswordResponse, otpResponse, OtpVerificationData, RegisterData, resetpasswordResponse, UserCredentials } from '../interfaces/auth.interface';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  // private apiurl='http://localhost:5000/auth/student';
  private apiurl=`${environment.apiUrl}/auth/student`

  constructor(private http:HttpClient,private tokenservice:TokenserviceService,private router:Router) { }

  register(userData:RegisterData):Observable<authResponse>{
    return this.http.post<authResponse>(`${this.apiurl}/register`,userData)
  }

  sendOtp(email:string):Observable<any>{
    return this.http.post(`${this.apiurl}/sendotp`,{email},{headers:{'Content-Type':'application/json'}})
  }


  verifyotp(data: { email: string, otp: string }): Observable<otpResponse> {
    console.log('enthano entho')
    return this.http.post<otpResponse>(`${this.apiurl}/verifyotp`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  login(userData:UserCredentials):Observable<authResponse>{
    console.log('studentinte login service')
      return this.http.post<authResponse>(`${this.apiurl}/login`,userData,{withCredentials:true}).pipe(
        tap((response:any)=>{
          this.tokenservice.setToken(response.accesstoken)
        })
      )
  }

  private accesstoken:string|null=null

  saveAccesstoken(token:string){
     this.accesstoken=token
  }

  getAccessToken():string|null{
    return this.tokenservice.getToken()
  }

  refreshToken():Observable<any>{
    console.log('Attempting to refresh token');
    console.log('so ingot ahn request varunnath not to instructor right ')
    return this.http.post<{success:boolean,accesstoken:string}>(`${this.apiurl}/refreshtoken`,{},{withCredentials:true}).pipe(
      tap(response=>{
        console.log('Refresh token success:', response);
        if(response.success&&response.accesstoken){
          this.saveAccesstoken(response.accesstoken)
          this.tokenservice.setToken(response.accesstoken)
        }else{
          throw new Error('Invalid refresh token response')
        }
      }),
      catchError(error=>{
        console.log('Refresh token error:', error);
        console.log(error)
        this.tokenservice.removeToken()
        throw error
      })
    )
  }


  logoutthestudent():Observable<void>{
    return this.http.post<void>(`${this.apiurl}/logout`,{},{withCredentials:true}).pipe(
      tap(()=>{
        this.tokenservice.removeToken()
        
      }),
      catchError((error)=>{
        throw error
      })
    )
  }


  forgotpassword(email:string):Observable<forgotpasswordResponse>{
    return this.http.post<forgotpasswordResponse>(`${this.apiurl}/forgotpassword`,{email})
  }

  resetpassword(token:string,password:string):Observable<resetpasswordResponse>{
    return this.http.post<resetpasswordResponse>(`${this.apiurl}/resetpassword/${token}`,{password})
  }



  
}
