import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../../interfaces/category.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl='http://localhost:5000/admin/category'

  constructor(private http:HttpClient) { }

  getAllCategories(page: number = 1, limit: number = 10): Observable<{
    categories: Category[],
    pagination: {
      total: number,
      page: number,
      limit: number,
      totalPages: number
    }
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}`, { params })
      .pipe(
        tap(response => {
          console.log('Response:', response);
          if (!response.pagination) {
            const categories = Array.isArray(response) ? response : [response];
            return {
              categories: categories,
              pagination: {
                total: categories.length,
                page: page,
                limit: limit,
                totalPages: Math.ceil(categories.length / limit)
              }
            };
          }
          return response;
        })
      );
  }

  createCategory(category:CreateCategoryDto):Observable<Category>{
    return this.http.post<Category>(`${this.apiUrl}`,category)
  }

  updateCategory(id:string,category:UpdateCategoryDto):Observable<Category>{
    return this.http.put<Category>(`${this.apiUrl}/${id}`,category)
  }

  deleteCategory(id:string):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }


}
