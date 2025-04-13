import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminserviceService } from '../../../services/adminservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-course-offer',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-course-offer.component.html',
  styleUrl: './add-course-offer.component.scss'
})
export class AddCourseOfferComponent {
   offerForm:FormGroup
   originalPrice:number

   constructor(
    private fb: FormBuilder,
    private adminService: AdminserviceService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddCourseOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courseId: string; courseTitle: string; price: number }
  ) {
    this.originalPrice = this.data.price;
    this.offerForm = this.fb.group({
      percentage: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      discountPrice: [{ value: '', disabled: true }]
    });

    this.offerForm.get('percentage')?.valueChanges.subscribe(percentage => {
      if (percentage >= 1 && percentage <= 99) {
        const discountPrice = Math.round((this.originalPrice - (this.originalPrice * (percentage / 100))) * 100) / 100;
        this.offerForm.patchValue({ discountPrice }, { emitEvent: false });
      }
    });
}



onSubmit() {
  if (this.offerForm.valid) {
    const offerData = {
      percentage: this.offerForm.get('percentage')?.value,
      discountPrice: this.offerForm.get('discountPrice')?.value
    };

    this.adminService.addCourseOffer(this.data.courseId, offerData).subscribe({
      next: (response) => {
        this.snackBar.open('Offer added successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open(error.error.message || 'Failed to add offer', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }
}

onCancel() {
  this.dialogRef.close();
}
}
