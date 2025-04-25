import { Component, OnInit } from '@angular/core';
import { AdminserviceService } from '../../../services/adminservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RefundconfirmationmodalComponent } from '../refundconfirmationmodal/refundconfirmationmodal.component';
import { MatDialog } from '@angular/material/dialog';

interface Course {
  courseId: string;
  amount: number;
  status: string;
  _id: string;
  cancellationDate?: string;
}

interface SalesHistory {
  _id: string;
  orderId: string;
  student: {
    name: string;
    email: string;
  };
  courses: Course[];
  totalAmount: number;
  purchaseDate: string;
  status: string;
  cancellationReason?: string[];
}

@Component({
  selector: 'app-saleshistory',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    FormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './saleshistory.component.html',
  styleUrl: './saleshistory.component.scss'
})
export class SaleshistoryComponent implements OnInit {
  salesHistory: SalesHistory[] = [];
  displayedColumns: string[] = ['orderId', 'student', 'courses', 'totalAmount', 'purchaseDate', 'status', 'actions'];
  isLoading = false;
  error: string | null = null;
  
  // Pagination
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];

  constructor(
    private adminService: AdminserviceService,
    private snackBar: MatSnackBar,
    private dialog:MatDialog
  ) {}

  ngOnInit() {
    this.loadSalesHistory();
  }

  loadSalesHistory() {
    this.adminService.getSalesHistory().subscribe({
      next: (response) => {
        this.salesHistory = response.sales;
        console.log('Sales data:', this.salesHistory);
      },
      error: (error) => {
        console.error('Error loading sales history:', error);
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSalesHistory();
  }

  approveRefund(orderId: string, courseId: string,amount:number): void {

   const dialogRef=this.dialog.open(
      RefundconfirmationmodalComponent,{
        width:'500px',
        data:{
          orderId,
          courseId,
          amount
        }
      }
   )


   dialogRef.afterClosed().subscribe(confirmed=>{
    if(confirmed){
      this.adminService.approveRefund({ orderId, courseId }).subscribe({
        next: (response) => {
          this.snackBar.open('Refund approved successfully', 'Close', { duration: 3000 });
          this.loadSalesHistory();
        },
        error: (error) => {
          this.snackBar.open('Failed to approve refund', 'Close', { duration: 3000 });
          console.error('Error approving refund:', error);
        }
      });
    }
   })



    
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }


  getTotalCourses(courses: Array<{ title: string }>): number {
    return courses.length;
  }


}
