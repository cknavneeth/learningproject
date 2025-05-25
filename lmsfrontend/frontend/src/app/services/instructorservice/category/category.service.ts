import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // private apiUrl='http://localhost:5000/admin/category'
  private apiUrl=`${environment.apiUrl}/admin/category`
 
  constructor(private http:HttpClient) { }

  getAllCategories():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`)
  }
}
