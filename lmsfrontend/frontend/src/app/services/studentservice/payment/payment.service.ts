import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Coupon } from '../../../interfaces/coupon.interface';
import { payoutData, PayoutResponse, PayoutUpdateResponse } from '../../../interfaces/payout.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  // private apiUrl='http://localhost:5000/student/payment';
  private apiUrl=`${environment.apiUrl}/student/payment`

  constructor(private http:HttpClient) { }

  createOrder(orderData:any):Observable<any>{

    const amountInPaise=Math.round(orderData.amount*100)
    const courseIds = orderData.items.map((item: {courseId: {_id?: string} | string}) => 
      typeof item.courseId === 'string' ? item.courseId : (item.courseId._id || ''));
    const payload = {
      amount: amountInPaise,
      currency: orderData.currency || 'INR',
      items: courseIds,
      coupon: orderData.coupon
    };
    console.log('Sending payload to backend:', payload);
    return this.http.post(`${this.apiUrl}/create-order`,payload)
  }

  // verifyPayment(paymentData:any):Observable<any>{
  //   console.log('Sending verification data:', paymentData);
  //   return this.http.post(`${this.apiUrl}/verify-payment`,paymentData)
  // }

  verifyPayment(paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }): Observable<any> {
    console.log('Sending verification data:', paymentData);
    return this.http.post(`${this.apiUrl}/verify-payment`, paymentData);
  }


  walletPayment(data:any):Observable<{success:true,message:'Wallet payment done'}>{
     console.log('for wallet payment',data)
     const payload={
      amount:data.amount,
      items:data.items,
      coupon:data.coupon
     }
     return this.http.post<{success:true,message:'Wallet payment done'}>(`${this.apiUrl}/wallet`,payload)

  }
  



  createpayoutDetails(payoutData:payoutData):Observable<{success:true,message:'Payout data got saved'}>{
        return this.http.post<{success:true,message:'Payout data got saved'}>(`${this.apiUrl}/payout`,payoutData)
  }
  

  withdrawMoney(amount:number):Observable<PayoutResponse>{
      return this.http.post<PayoutResponse>(`${this.apiUrl}/instructor/withdraw`,{amount})
  }


  getInstructorPayout():Observable<payoutData>{
     return this.http.get<payoutData>(`${this.apiUrl}/instructor/getPayout`)
  }

  updateInstructorPayout(payoutData:payoutData):Observable<PayoutUpdateResponse>{
     return this.http.put<PayoutUpdateResponse>(`${this.apiUrl}/instructor/editpayout`,payoutData)
  }


}
