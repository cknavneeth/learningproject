import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private apiUrl = 'http://localhost:5000/auth/student/wishlist';


  private wishlistItemsSubject=new BehaviorSubject<number>(0)
  wishlistItems$=this.wishlistItemsSubject.asObservable()
  
  constructor(private http:HttpClient) {
    this.getWishlist().subscribe(
      wishlist=>this.updateWishlistCount(wishlist)
    )
   }


   getWishlist():Observable<any>{
    return this.http.get(`${this.apiUrl}`)
   }

   addToWishlist(courseId:string):Observable<any>{
    return this.http.post(`${this.apiUrl}/add`,{courseId})
    .pipe(
      tap(wishlist=>{
        this.updateWishlistCount(wishlist)
      })
    )
   }

   removeFromWishlist(courseId:string):Observable<any>{
    return this.http.delete(`${this.apiUrl}/remove`,{body:{courseId}})
    .pipe(
      tap(wishlist=>{
        this.updateWishlistCount(wishlist)
      })
    )
   }

   private updateWishlistCount(wishlist: any) {
    this.wishlistItemsSubject.next(wishlist?.courses?.length || 0);
  }
}
