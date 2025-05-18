import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cart, CartResponse } from '../../../interfaces/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // private apiUrl = 'http://localhost:5000/auth/student/cart';
  private apiUrl=`${environment.apiUrl}/auth/student/cart`

  private cartItemsSubject=new BehaviorSubject<number>(0)
  cartItems$=this.cartItemsSubject.asObservable()

  constructor(private http:HttpClient) {
    this.getCart().subscribe(
      cart=>this.updateCartCount(cart)
    )
   }

  addToCart(courseId:string):Observable<CartResponse>{
    const url = `${this.apiUrl}/add`;
    console.log('Making request to:', url); 
    console.log('With payload:', { courseId });  
    return this.http.post<CartResponse>(`${this.apiUrl}/add`,{courseId})
    .pipe(
      tap(cart=>{
        console.log('Cart response',cart)
        this.updateCartCount(cart)
      })
    )
  }


  private updateCartCount(cart: Cart | null) {
    this.cartItemsSubject.next(cart?.items?.length || 0);
  }

  getCart():Observable<CartResponse>{
    return this.http.get<CartResponse>(`${this.apiUrl}`)
  }


  removeFromCart(courseId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.apiUrl}/remove`, { body: { courseId } }).pipe(
      tap(cart => this.updateCartCount(cart))
    );
  }


  clearCart():Observable<CartResponse>{
     return this.http.delete<CartResponse>(`${this.apiUrl}/clear`).pipe(
      tap(cart=>this.updateCartCount(cart)),
      catchError(error=>{
        console.error('Error clearing cart:',error)
        throw error
      })
     )
  }

  
}
