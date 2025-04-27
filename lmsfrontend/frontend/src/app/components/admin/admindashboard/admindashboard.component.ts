import { Component, OnInit } from '@angular/core';
import { AdminserviceService } from '../../../services/adminservice.service';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


Chart.register(...registerables);

@Component({
  selector: 'app-admindashboard',
  imports: [CommonModule,FormsModule],
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.scss'
})
export class AdmindashboardComponent implements OnInit{

  dashboardStats:any={
    totalStudents:0,
    totalInstructors:0,
    totalCourses:0,
    totalRevenue:0,
    totalPurchases:0,
    monthlySalesData:[]
  }

  constructor(private adminService:AdminserviceService){}

  ngOnInit(): void {
    this.loadDashboardStats()
  }

  loadDashboardStats(){
    this.adminService.getDashboarStats().subscribe({
      next:(data)=>{
        this.dashboardStats=data
        this.initializeChart()
      },
      error:(error)=>{
        console.error('error loading dashboard stats',error)
      }
    })
  }


  initializeChart(){
    this.createRevenueChart()
    this.createPurchasesChart()
  }

  createRevenueChart(){
    const ctx=document.getElementById('revenueChart') as HTMLCanvasElement;
    new Chart(ctx,{
      type:'line',
      data:{
        labels: this.dashboardStats.monthlySalesData.map((data: any) => data.month),
        datasets: [{
          label: 'Monthly Revenue',
          data: this.dashboardStats.monthlySalesData.map((data: any) => data.revenue),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options:{
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }



  createPurchasesChart(){
    const ctx=document.getElementById('purchasesChart') as HTMLCanvasElement;
    new Chart(ctx,{
      type:'bar',
      data:{
        labels: this.dashboardStats.monthlySalesData.map((data: any) => data.month),
        datasets: [{
          label: 'Monthly Purchases',
          data: this.dashboardStats.monthlySalesData.map((data: any) => data.purchases),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgb(153, 102, 255)',
          borderWidth: 1
        }]
      },
      options:{
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }

    })
  }
}
