import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateReviewDto, Review, UpdateReviewDto } from '../../../interfaces/review.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  // private apiUrl='http://localhost:5000/review'
  private apiUrl=`${environment.apiUrl}/review`

  constructor(private http:HttpClient){}

  createReview(courseId:string,review:CreateReviewDto):Observable<Review>{
    return this.http.post<Review>(`${this.apiUrl}/course/${courseId}`,review)
  }


  getReviewsByCourse(courseId:string):Observable<Review[]>{
    return this.http.get<Review[]>(`${this.apiUrl}/course/${courseId}`)
  }


  updateReview(reviewId:string,review:UpdateReviewDto):Observable<Review>{
    return this.http.put<Review>(`${this.apiUrl}/${reviewId}`,review)

  }

  deleteReview(reviewId: string): Observable<Review> {
    return this.http.delete<Review>(`${this.apiUrl}/${reviewId}`);
  }


  getUserReviewForCourse(courseId:string):Observable<Review>{
    return this.http.get<Review>(`${this.apiUrl}/course/${courseId}/user-review`)
  }
  

   addInstructorReply(reviewId: string, instructorReply: string): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/${reviewId}/instructor-reply`, { instructorReply });
  }
  
}
