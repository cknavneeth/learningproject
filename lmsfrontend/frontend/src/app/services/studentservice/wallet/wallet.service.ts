import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TransactionsResponse } from '../../../interfaces/wallet.interface';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  // private apiUrl='http://localhost:5000/auth/student';
  private apiUrl=`${environment.apiUrl}/auth/student`

  constructor(private http:HttpClient) { }

  getWalletBalance():Observable<{wallet:number}>{
    return this.http.get<{wallet:number}>(`${this.apiUrl}/wallet`)
  }


  getRecentTransactions():Observable<TransactionsResponse>{
    return this.http.get<TransactionsResponse>(`${this.apiUrl}/transactions`)
  }
}
