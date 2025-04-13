import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CouponService } from '../../../services/adminservice/coupon/coupon.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addcoupon',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './addcoupon.component.html',
  styleUrl: './addcoupon.component.scss'
})
export class AddcouponComponent implements OnInit{
  couponForm: FormGroup;
  minDate:string
  isEditMode=false
  couponId:string|null=null

  constructor(
    private fb: FormBuilder,
    private couponService: CouponService,
    private snackBar: MatSnackBar,
    private route:ActivatedRoute,
    private router:Router
  ) {
    //here iam setting minimum date to tommorow
    const tomorrow=new Date()
    tomorrow.setDate(tomorrow.getDate()+1)
    this.minDate = tomorrow.toISOString().split('T')[0];



    this.couponForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Za-z0-9]+$')]],
      type: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      maxUses: ['', [Validators.required, Validators.min(1)]],
      expiryDate: ['', [Validators.required, this.futureDateValidator()]],
      minPurchaseAmount: ['', [Validators.required, Validators.min(0)]],
      maxDiscountAmount: ['', [Validators.min(0)]],
      description: ['', [Validators.maxLength(200)]],
      isActive: [true]
    },
  {
    validators:this.minPurchaseAmountValidator()
  });
  }

  futureDateValidator() {
    return (control: any) => {
      if (control.value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputDate = new Date(control.value);
        if (inputDate <= today) {
          return { 'pastDate': true };
        }
      }
      return null;
    };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.couponForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }


  private minPurchaseAmountValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const minPurchaseAmount = formGroup.get('minPurchaseAmount')?.value;
      const maxDiscountAmount = formGroup.get('maxDiscountAmount')?.value;
  
      if (maxDiscountAmount && minPurchaseAmount <= maxDiscountAmount) {
        return { minPurchaseAmountInvalid: true };
      }
  
      return null;
    };
  }


  onSubmit() {
    if (this.couponForm.valid) {
      if (this.isEditMode && this.couponId) {
        // Update existing coupon
        this.couponService.updateCoupon(this.couponId, this.couponForm.value).subscribe({
          next: (response) => {
            this.snackBar.open('Coupon updated successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            this.router.navigate(['/admin/coupons']); // Navigate back to coupons list
          },
          error: (error) => {
            this.snackBar.open(error.error.message || 'Failed to update coupon', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
        });
      }else {
        // Create new coupon
        this.couponService.createCoupon(this.couponForm.value).subscribe({
          next: (response) => {
            this.snackBar.open('Coupon created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            this.router.navigate(['/admin/coupons']); // Navigate back to coupons list
          },
          error: (error) => {
            this.snackBar.open(error.error.message || 'Failed to create coupon', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
        });
      }
    }
  }


  ngOnInit(): void {
      this.route.queryParams.subscribe(params=>{
        if(params['id']){
          this.isEditMode=true
          this.couponId=params['id']
          if(this.couponId)
          this.loadCouponData(this.couponId)
        }
      })
  }


  private loadCouponData(id: string) {
    this.couponService.getCouponById(id).subscribe({
      next: (coupon) => {
        // Format the date to YYYY-MM-DD for the input field
        const formattedDate = new Date(coupon.expiryDate)
          .toISOString().split('T')[0];
        
        this.couponForm.patchValue({
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          maxUses: coupon.maxUses,
          expiryDate: formattedDate,
          minPurchaseAmount: coupon.minPurchaseAmount,
          maxDiscountAmount: coupon.maxDiscountAmount,
          description: coupon.description,
          isActive: coupon.isActive
        });
      },
      error: (error) => {
        this.snackBar.open('Error loading coupon data', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/admin/coupons']);
      }
    });
  }
}
