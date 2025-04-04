import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleauthService {

  constructor(private http:HttpClient) { }

  private apiurl='http://localhost:5000/auth'

  verifyGoogleToken(credential:string,role?:'student'|'instructor'){
    console.log(`verifying google token for ${role}`)
    return this.http.post(`${this.apiurl}/${role}/google`,{credential},{withCredentials:true})
  }
}
