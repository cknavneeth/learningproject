import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { TokenserviceService } from './tokenservice.service';
import { OtpVerificationData } from '../interfaces/auth.interface';

interface LoginResponse{
  accesstoken:string;
  message:string
}


@Injectable({
  providedIn: 'root'
})
export class InstructorauthserviceService {

  private apiurl='http://localhost:5000/auth/instructor'

  constructor(private http:HttpClient,private tokenservice:TokenserviceService) { }

  registerinstructor(formdata:FormData){
       return this.http.post(`${this.apiurl}/instructorRegister`,formdata)
  }

  sendOtp(emailaddress:string):Observable<any>{
    
    return this.http.post(`${this.apiurl}/insotp`,{emailaddress},{headers:{'Content-Type':'application/json'}})
  }

  verifyotp(data:{emailaddress:string,otp:string}):Observable<any>{
    
    const fullUrl = `${this.apiurl}/verifyinsotp`;
    console.log('INSTRUCTOR SERVICE - Making request to:', fullUrl);
    console.log('INSTRUCTOR SERVICE - With data:', data);


    
    return this.http.post(`${this.apiurl}/verifyinsotp`,data,{headers:{'Content-Type':'application/json'}})
  }

  login(instructorData:any):Observable<any>{
    console.log('instructor login service ahn ith')
    return this.http.post<LoginResponse>(`${this.apiurl}/inslogin`,instructorData,{withCredentials:true}).pipe(
      tap((response)=>{
        console.log('login is successfull')
          this.saveAccesstoken(response.accesstoken)
          this.tokenservice.setInstructorToken(response.accesstoken)
      })
    )
  }

  private accesstoken:string|null=null

  saveAccesstoken(token:string){
         this.accesstoken=token
  }

  getAccessToken():string|null{
    return this.tokenservice.getInstructorToken()
  }

  refreshToken(){
    return this.http.post<LoginResponse>(`${this.apiurl}/getinsAccess`,{},{withCredentials:true}).pipe(
      tap((response)=>{
        this.saveAccesstoken(response.accesstoken)
        this.tokenservice.setInstructorToken(response.accesstoken)
      }),
      catchError((error)=>{
        this.tokenservice.removeInstructorToken()
        throw error
      })
    )
  }



  forgotpasswordInstructor(emailaddress:string):Observable<any>{
         return this.http.post(`${this.apiurl}/forgotpasswordinstructor`,{emailaddress})
  }


  resetpasswordinstructor(token:string,password:string):Observable<any>{
    return this.http.post(`${this.apiurl}/resetpasswordinstructor/${token}`,{password})
  }



  logoutinstructor():Observable<any>{
    return this.http.post(`${this.apiurl}/logout`,{},{withCredentials:true}).pipe(
      tap(()=>{
        this.tokenservice.removeInstructorToken()
      }),
      catchError((error)=>{
        throw error
      })
    )
  }
}
