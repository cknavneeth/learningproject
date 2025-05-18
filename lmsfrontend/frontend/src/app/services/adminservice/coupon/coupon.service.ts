import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  // private apiUrl='http://localhost:5000/admin/coupon'
  private apiUrl=`${environment.apiUrl}/admin/coupon`

  constructor(private http:HttpClient) { }

  createCoupon(couponData:any):Observable<any>{
    console.log('philipinte pari')
    return this.http.post(`${this.apiUrl}`,couponData)
  }
  getAllCoupons(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  updateCoupon(id: string, couponData: any): Observable<any> {
    console.log('there is no philipinte pari')
    return this.http.put(`${this.apiUrl}/${id}`, couponData);
  }

  deleteCoupon(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCouponById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
