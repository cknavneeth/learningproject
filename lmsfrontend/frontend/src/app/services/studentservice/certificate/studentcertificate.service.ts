import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentcertificateService {

  private readonly baseUrl='http://localhost:5000/certificate';

  constructor(private http:HttpClient) { }


  generateCertificate(courseId:string):Observable<any>{
    return this.http.post(`${this.baseUrl}/generate`,{courseId})
  }

  getUserCertificates(page:number=1,limit:number=10):Observable<any>{
    return this.http.get(`${this.baseUrl}?page=${page}&limit=${limit}`)
  }


  getCertificateById(certificateId:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/${certificateId}`)
  }
}
