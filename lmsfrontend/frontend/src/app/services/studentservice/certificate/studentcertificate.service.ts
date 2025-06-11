import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Certificate, CertificateResponse, CertificatesListResponse } from '../../../interfaces/certificate.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentcertificateService {

  // private readonly baseUrl='http://localhost:5000/certificate';
  private readonly baseUrl=`${environment.apiUrl}/certificate`

  constructor(private http:HttpClient) { }


  generateCertificate(courseId:string):Observable<Certificate>{
    return this.http.post<Certificate>(`${this.baseUrl}/generate`,{courseId})
  }

  getUserCertificates(page:number=1,limit:number=10):Observable<CertificatesListResponse>{
    return this.http.get<CertificatesListResponse>(`${this.baseUrl}?page=${page}&limit=${limit}`)
  }


  getCertificateById(certificateId:string):Observable<CertificateResponse>{
    return this.http.get<CertificateResponse>(`${this.baseUrl}/${certificateId}`)
  }
}
