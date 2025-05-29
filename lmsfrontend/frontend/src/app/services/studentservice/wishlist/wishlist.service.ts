import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WishlistResponse } from '../../../interfaces/wishlist.interface';
import { TokenserviceService } from '../../tokenservice.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  // private apiUrl = 'http://localhost:5000/auth/student/wishlist';
  private apiUrl=`${environment.apiUrl}/auth/student/wishlist`


  private wishlistItemsSubject=new BehaviorSubject<number>(0)
  wishlistItems$=this.wishlistItemsSubject.asObservable()
  
  constructor(private http:HttpClient,private tokenservice:TokenserviceService) {
    if(this.tokenservice.getStudentToken())
    this.getWishlist().subscribe(
      wishlist=>this.updateWishlistCount(wishlist)
    )
   }


   getWishlist():Observable<WishlistResponse>{
    return this.http.get<WishlistResponse>(`${this.apiUrl}`)
   }

   addToWishlist(courseId:string):Observable<WishlistResponse>{
    return this.http.post<WishlistResponse>(`${this.apiUrl}/add`,{courseId})
    .pipe(
      tap(wishlist=>{
        this.updateWishlistCount(wishlist)
      })
    )
   } 

   removeFromWishlist(courseId:string):Observable<WishlistResponse>{
    return this.http.delete<WishlistResponse>(`${this.apiUrl}/remove`,{body:{courseId}})
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
