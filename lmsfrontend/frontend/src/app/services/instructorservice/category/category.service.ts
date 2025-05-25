import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CategoryResponse } from '../../../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // private apiUrl='http://localhost:5000/admin/category'
  private apiUrl=`${environment.apiUrl}/admin/category`
 
  constructor(private http:HttpClient) { }

  getAllCategories():Observable<CategoryResponse>{
    return this.http.get<CategoryResponse>(`${this.apiUrl}`)
  }

}
