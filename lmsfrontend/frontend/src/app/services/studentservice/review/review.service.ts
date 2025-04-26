import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateReviewDto, Review, UpdateReviewDto } from '../../../interfaces/review.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl='http://localhost:5000/review'

  constructor(private http:HttpClient){}

  createReview(courseId:string,review:CreateReviewDto):Observable<any>{
    return this.http.post<Review>(`${this.apiUrl}/course/${courseId}`,review)
  }


  getReviewsByCourse(courseId:string):Observable<any>{
    return this.http.get<Review[]>(`${this.apiUrl}/course/${courseId}`)
  }


  updateReview(reviewId:string,review:UpdateReviewDto):Observable<any>{
    return this.http.put<Review>(`${this.apiUrl}/${reviewId}`,review)

  }

  deleteReview(reviewId: string): Observable<Review> {
    return this.http.delete<Review>(`${this.apiUrl}/${reviewId}`);
  }

  
}
