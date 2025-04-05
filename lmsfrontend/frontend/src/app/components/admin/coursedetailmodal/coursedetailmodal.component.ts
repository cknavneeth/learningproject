import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-coursedetailmodal',
  imports: [CommonModule,FormsModule],
  templateUrl: './coursedetailmodal.component.html',
  styleUrl: './coursedetailmodal.component.scss'
})
export class CoursedetailmodalComponent {

  showFeedbackForm:boolean=false
  feedbackText:string=''


   constructor(
    public dialogRef:MatDialogRef<CoursedetailmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public course:any
   ){}


   close(): void {
    this.dialogRef.close();
  }

  approveCourse(): void {
    this.dialogRef.close({ action: 'approve' });
  }

  rejectCourse(): void {
    this.dialogRef.close({ action: 'reject' });
  }

  showRejectionForm():void{
    this.showFeedbackForm=true
  }

  submitRejection():void{
    if(!this.feedbackText.trim()){
      return
    }
    this.dialogRef.close({
      action:'reject','feedback':this.feedbackText
    })
  }
}
