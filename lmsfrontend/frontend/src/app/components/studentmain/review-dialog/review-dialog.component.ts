import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Review } from '../../../interfaces/review.interface';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-review-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './review-dialog.component.html',
  styleUrl: './review-dialog.component.scss'
})
export class ReviewDialogComponent implements OnInit{
    reviewForm:FormGroup
    sliderValue=1
    isEditMode=false

    constructor(private fb:FormBuilder,
      private dialogRef:MatDialogRef<ReviewDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data:{
        courseId:string,
        isEdit?:boolean,
        review?:Review
      }
    ){
         this.reviewForm=this.fb.group({
          rating:['1',[Validators.required,Validators.min(1),Validators.max(5)]],
          comment:['',[Validators.required,Validators.minLength(10)]]

         })
    }

    ngOnInit(): void {
       this.isEditMode=!! this.data.isEdit

       if(this.isEditMode&&this.data.review){
        this.reviewForm.patchValue({
          rating:this.data.review.rating.toString(),
          comment:this.data.review.comment
        })
       }
    }

    onSubmit():void{
      if(this.reviewForm.valid){
        this.dialogRef.close(this.reviewForm.value)
      }
    }

    onCancel(){
      this.dialogRef.close()
    }

    onSliderChange(event: any) {
      this.reviewForm.patchValue({
        rating: event.value
      });
    }

    
  setRating(rating: number): void {
     this.reviewForm.get('rating')?.setValue(rating.toString());
  }
}
