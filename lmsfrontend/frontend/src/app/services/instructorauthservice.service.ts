import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorauthserviceService {

  private apiurl='http://localhost:5000/auth'

  constructor(private http:HttpClient) { }

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
}
