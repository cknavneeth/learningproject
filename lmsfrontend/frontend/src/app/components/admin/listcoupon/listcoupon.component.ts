import { Component } from '@angular/core';
import { CouponService } from '../../../services/adminservice/coupon/coupon.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationcomponentComponent } from '../../common/confirmationcomponent/confirmationcomponent.component';

@Component({
  selector: 'app-listcoupon',
  imports: [MatPaginatorModule,CommonModule, MatTableModule,MatIconModule,RouterModule],
  templateUrl: './listcoupon.component.html',
  styleUrl: './listcoupon.component.scss'
})
export class ListcouponComponent {
    coupons:any[]=[]

    displayedColumns:string[]=['code','type','value','maxUses','currentUses','expiryDate','actions']
    totalItems: number = 0;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    loading: boolean = false;
  
    constructor(
      private couponService: CouponService,
      private snackBar: MatSnackBar,
      private dialog: MatDialog,
      private router:Router
    ) {}
  
    ngOnInit() {
      this.loadCoupons();
    }

    loadCoupons() {
      this.loading = true;
      this.couponService.getAllCoupons(this.currentPage, this.itemsPerPage).subscribe({
        next: (response) => {
          this.coupons = response.coupons;
          this.totalItems = response.pagination.total;
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Error loading coupons', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }


    onPageChange(event: any) {
      this.currentPage = event.pageIndex + 1;
      this.itemsPerPage = event.pageSize;
      this.loadCoupons();
    }

    deleteCoupon(id: string,code:string) {
      const dialogRef = this.dialog.open(ConfirmationcomponentComponent, {
        data: {
          title: 'Confirm Deletion',
          message: `Are you sure you want to delete coupon "${code}"?`
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.couponService.deleteCoupon(id).subscribe({
            next: () => {
              this.snackBar.open('Coupon deleted successfully', 'Close', { 
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top'
              });
              this.loadCoupons();
            },
            error: (error) => {
              this.snackBar.open('Error deleting coupon', 'Close', { 
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top'
              });
            }
          });
        }
      });
    }
  

    editCoupon(coupon:any){
      this.router.navigate(['/admin/coupons/add'],{
        queryParams:{id:coupon._id}
      })
    }
  
}
