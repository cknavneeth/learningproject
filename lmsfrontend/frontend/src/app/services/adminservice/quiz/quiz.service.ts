import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // private apiUrl = 'http://localhost:5000/quiz';
  private apiUrl=`${environment.apiUrl}/quiz`

  constructor(private http: HttpClient) { }

  generateQuiz(topic:string):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/generate`,{topic})
  }

  getAllQuizzes():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/history`)
  }

  submitQuiz(quizId:string,answers:number[],questions:any[]):Observable<any>{

    const topic=this.getTopicFromQuiz(questions)

    console.log('Submitting quiz with data:', {
      quizId,
      topic,
      answers,
      questions
    });
    
    return this.http.post<any>(`${this.apiUrl}/submit`,{
      quizId,
      topic,
      answers,
      questions
    })
  }



  getQuizHistory():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/userHistory`)
  }

  private getTopicFromQuiz(questions: any[]): string {
    // Case 1: If questions array is empty, return empty string
    if (!questions || questions.length === 0) {
      return '';
    }
    
    // Case 2: Check if topic exists in any question
    for (const question of questions) {
      if (question && question.topic) {
        return question.topic;
      }
    }
    
    // Case 3: Check if there's a topic property in the first question's parent object
    if (questions[0] && questions[0].hasOwnProperty('__parent') && questions[0].__parent && questions[0].__parent.topic) {
      return questions[0].__parent.topic;
    }
    
    // Default: return empty string if no topic found
    return '';
  }




  deleteQuiz(quizId:string):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${quizId}`)
  }
}
