import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CouponResponse, ValidateCouponResponse } from '../../../interfaces/coupon.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentcouponService {

  // private apiUrl = 'http://localhost:5000/student/coupons';
  private apiUrl=`${environment.apiUrl}/student/coupons`

  constructor(private http:HttpClient) { }

  getAvailableCoupons(totalAmount:number):Observable<CouponResponse>{
    return this.http.get<CouponResponse>(`${this.apiUrl}/available?amount=${totalAmount}`)
  }


  validateCoupon(code:string,amount:number):Observable<ValidateCouponResponse>{
    return this.http.post<ValidateCouponResponse>(`${this.apiUrl}/validate`,{code,amount})
  }
}
