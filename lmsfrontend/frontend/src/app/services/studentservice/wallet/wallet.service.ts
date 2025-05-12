import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private apiUrl='http://localhost:5000/auth/student';

  constructor(private http:HttpClient) { }

  getWalletBalance():Observable<{wallet:number}>{
    return this.http.get<{wallet:number}>(`${this.apiUrl}/wallet`)
  }
}
