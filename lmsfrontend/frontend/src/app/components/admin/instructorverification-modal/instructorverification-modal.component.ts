import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { instructors } from '../../../interfaces/auth.interface';
import { AdminserviceService } from '../../../services/adminservice.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-instructorverification-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './instructorverification-modal.component.html',
  styleUrls: ['./instructorverification-modal.component.scss']
})
export class InstructorverificationModalComponent {

  feedbackText:string=''
  showFeedbackForm:boolean=false


  constructor(
    public dialogRef: MatDialogRef<InstructorverificationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public Instructor: instructors,
    private adminService: AdminserviceService
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  async acceptVerification(): Promise<void> {
    this.adminService.verifyInstructor(this.Instructor._id, true).subscribe(updated => {
      this.Instructor = updated;
      this.dialogRef.close(true); 
    });
  }

  showRejectionForm():void{
    this.showFeedbackForm=true
  }

  async submitRejection():Promise<void>{
    if(!this.feedbackText.trim()){
      return
    }
    this.adminService.verifyInstructor(this.Instructor._id,false,this.feedbackText).subscribe(updated=>{
      this.Instructor=updated
      this.dialogRef.close(true)
    })
  }

  async rejectVerification(): Promise<void> {
    this.adminService.verifyInstructor(this.Instructor._id, false).subscribe(updated => {
      this.Instructor = updated;
      this.dialogRef.close(true);
    });
  }
}
