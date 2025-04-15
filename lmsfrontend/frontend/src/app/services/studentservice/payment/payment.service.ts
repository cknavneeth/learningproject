import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl='http://localhost:5000/student/payment';

  constructor(private http:HttpClient) { }

  createOrder(orderData:any):Observable<any>{

    const amountInPaise=Math.round(orderData.amount*100)
    const payload = {
      amount: amountInPaise,
      currency: orderData.currency || 'INR',
      items: orderData.items,
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
  
}
