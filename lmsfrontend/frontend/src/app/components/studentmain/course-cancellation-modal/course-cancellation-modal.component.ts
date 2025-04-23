import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-course-cancellation-modal',
  imports: [CommonModule,FormsModule],
  templateUrl: './course-cancellation-modal.component.html',
  styleUrl: './course-cancellation-modal.component.scss'
})
export class CourseCancellationModalComponent {
     reason:string=''

     constructor(
      public dialogRef:MatDialogRef<CourseCancellationModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data:{
        courseId:string,
        courseName:string,
        purchaseDate:Date,
        isEligible:boolean
      }
     ){}


     onClose():void{
      this.dialogRef.close()
     }

     onConfirm():void{
      if(this.reason.trim()){
        this.dialogRef.close({confirmed:true,reason:this.reason})
      }
     }
}
