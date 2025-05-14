import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Review } from '../../../interfaces/review.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-instructorreplydialog',
  imports: [ReactiveFormsModule,CommonModule,MatIconModule],
  templateUrl: './instructorreplydialog.component.html',
  styleUrl: './instructorreplydialog.component.scss'
})
export class InstructorreplydialogComponent {

   replyForm:FormGroup

   isEditMode=false

   constructor(
    private fb:FormBuilder,
    public dialogRef:MatDialogRef<InstructorreplydialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{review:Review}
   ){
    this.replyForm=this.fb.group({
      instructorReply:['',[Validators.required,Validators.minLength(5)]]
    })
   }

     ngOnInit(): void {
    if (this.data.review.instructorReply) {
      this.isEditMode = true;
      this.replyForm.patchValue({
        instructorReply: this.data.review.instructorReply
      });
    }
  }

  onSubmit(): void {
    if (this.replyForm.valid) {
      this.dialogRef.close(this.replyForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
