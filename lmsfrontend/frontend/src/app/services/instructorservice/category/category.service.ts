import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl='http://localhost:5000/admin/category'

  constructor(private http:HttpClient) { }

  getAllCategories():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`)
  }
}
