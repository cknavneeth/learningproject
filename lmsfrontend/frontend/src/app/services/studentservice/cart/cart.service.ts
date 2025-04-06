import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:5000/auth/student/cart';

  private cartItemsSubject=new BehaviorSubject<number>(0)
  cartItems$=this.cartItemsSubject.asObservable()

  constructor(private http:HttpClient) {
    this.getCart().subscribe(
      cart=>this.updateCartCount(cart)
    )
   }

  addToCart(courseId:string):Observable<any>{
    const url = `${this.apiUrl}/add`;
    console.log('Making request to:', url);  // Debug log
    console.log('With payload:', { courseId });  // Debug log
    return this.http.post(`${this.apiUrl}/add`,{courseId})
    .pipe(
      tap(cart=>{
        console.log('Cart response',cart)
        this.updateCartCount(cart)
      })
    )
  }


  private updateCartCount(cart: any) {
    this.cartItemsSubject.next(cart?.items?.length || 0);
  }

  getCart():Observable<any>{
    return this.http.get(`${this.apiUrl}`)
  }


  removeFromCart(courseId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove`, { body: { courseId } }).pipe(
      tap(cart => this.updateCartCount(cart))
    );
  }

}
