import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminserviceService {

  constructor(private http:HttpClient) { }

  private apiurl='http://localhost:5000/auth/admin';

  adminloginform(adminData:any){
    return this.http.post(`${this.apiurl}/login`,adminData)
  }
}
