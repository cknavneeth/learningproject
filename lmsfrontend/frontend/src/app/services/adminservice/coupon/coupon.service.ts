import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Coupon, CouponCreateDto, CouponResponse } from '../../../interfaces/coupon.interface';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  // private apiUrl='http://localhost:5000/admin/coupon'
  private apiUrl=`${environment.apiUrl}/admin/coupon`

  constructor(private http:HttpClient) { }

  createCoupon(couponData:CouponCreateDto):Observable<Coupon>{
    return this.http.post<Coupon>(`${this.apiUrl}`,couponData)
  }
  getAllCoupons(page: number = 1, limit: number = 10): Observable<CouponResponse> {
    return this.http.get<CouponResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  updateCoupon(id: string, couponData: any): Observable<Coupon> {
    console.log('there is no philipinte pari')
    return this.http.put<Coupon>(`${this.apiUrl}/${id}`, couponData);
  }

  deleteCoupon(id: string): Observable<{success:boolean,message:string}> {
    return this.http.delete<{success:boolean,message:string}>(`${this.apiUrl}/${id}`);
  }

  getCouponById(id: string): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiUrl}/${id}`);
  }
}
