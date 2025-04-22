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
import { SalesHistory } from '../../../interfaces/saleshistory.interface' 

@Component({
  selector: 'app-saleshistory',
  standalone: true,
  imports: [
    MatPaginatorModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './saleshistory.component.html',
  styleUrls: ['./saleshistory.component.scss']
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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSalesHistory();
  }

  loadSalesHistory(): void {
    this.isLoading = true;
    this.error = null;

    this.adminService.getSalesHistory(this.pageIndex + 1, this.pageSize).subscribe({
      next: (response) => {
        this.salesHistory = response.sales;
        this.totalItems = response.pagination.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load sales history';
        this.isLoading = false;
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSalesHistory();
  }

  approveRefund(orderId: string): void {
    this.adminService.approveRefund(orderId).subscribe({
      next: () => {
        this.snackBar.open('Refund approved successfully', 'Close', { duration: 3000 });
        this.loadSalesHistory();
      },
      error: (error) => {
        this.snackBar.open('Failed to approve refund', 'Close', { duration: 3000 });
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getTotalCourses(courses: Array<{ title: string }>): number {
    return courses.length;
  }
}
