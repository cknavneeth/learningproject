import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { TokenserviceService } from './tokenservice.service';

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
    console.log('vilikan povunnu',emailaddress)
    return this.http.post(`${this.apiurl}/insotp`,{emailaddress},{headers:{'Content-Type':'application/json'}})
  }

  verifyOtp(emailaddress:string,otp:string){
    return this.http.post(`${this.apiurl}/verifyinsotp`,{emailaddress,otp})
  }

  login(instructorData:any):Observable<any>{
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

}
