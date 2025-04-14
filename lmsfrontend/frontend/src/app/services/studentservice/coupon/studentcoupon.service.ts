import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentcouponService {

  private apiUrl = 'http://localhost:5000/student/coupons';

  constructor(private http:HttpClient) { }

  getAvailableCoupons(totalAmount:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/available?amount=${totalAmount}`)
  }


  validateCoupon(code:string,amount:number):Observable<any>{
    return this.http.post(`${this.apiUrl}/validate`,{code,amount})
  }
}
