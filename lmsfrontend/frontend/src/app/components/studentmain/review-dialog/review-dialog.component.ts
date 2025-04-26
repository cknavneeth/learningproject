import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-review-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatSliderModule,
    ReactiveFormsModule
  ],
  templateUrl: './review-dialog.component.html',
  styleUrl: './review-dialog.component.scss'
})
export class ReviewDialogComponent {
    reviewForm:FormGroup
    sliderValue=1

    constructor(private fb:FormBuilder,
      private dialogRef:MatDialogRef<ReviewDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data:{courseId:string}
    ){
         this.reviewForm=this.fb.group({
          rating:['1',[Validators.required,Validators.min(1),Validators.max(5)]],
          comment:['',[Validators.required,Validators.minLength(10)]]

         })
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
}
