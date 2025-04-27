import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Chart, registerables } from 'chart.js';
import { instructorDashboard } from '../../../interfaces/dashboard.interface';
import { DashboardService } from '../../../services/instructorservice/dashboard/dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-instructor-dashboard',
  imports: [CommonModule,MatCardModule],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.scss'
})
export class InstructorDashboardComponent implements OnInit{

    stats:instructorDashboard|null=null;
    salesChart:any

    constructor(private dashboardService:DashboardService){}

    ngOnInit(){
      this.loadDashboardStats()
    }


    loadDashboardStats(){
      this.dashboardService.getDashboardStats().subscribe({
        next:(data)=>{
          console.log('dashboard stats loaded',data)
          this.stats=data
          this.initializeChart()
        },
        error:(error)=>{
          console.error('error loading dashboard stats',error)
        }
      })
    }






    private initializeChart() {
      if (!this.stats) return;
  
      const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
      if (this.salesChart) {
        this.salesChart.destroy();
      }
  
      this.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.stats.monthlySalesData.map(data => data.month),
          datasets: [
            {
              label: 'Revenue',
              data: this.stats.monthlySalesData.map(data => data.revenue),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            },
            {
              label: 'Purchases',
              data: this.stats.monthlySalesData.map(data => data.purchases),
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }



}
