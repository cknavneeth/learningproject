import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private apiUrl = 'http://localhost:5000/quiz';

  constructor(private http: HttpClient) { }

  generateQuiz(topic:string):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/generate`,{topic})
  }

  getAllQuizzes():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/history`)
  }


}
