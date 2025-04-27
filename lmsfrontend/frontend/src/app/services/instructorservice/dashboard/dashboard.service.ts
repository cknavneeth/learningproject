import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { instructorDashboard } from '../../../interfaces/dashboard.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  private apiUrl='http://localhost:5000/auth/instructor'

  constructor(private http:HttpClient) { }

  getDashboardStats():Observable<instructorDashboard>{
    return this.http.get<instructorDashboard>(`${this.apiUrl}/dashboard-stats`)
  }
}
