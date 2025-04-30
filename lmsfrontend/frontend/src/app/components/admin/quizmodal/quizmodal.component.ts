import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quizmodal',
  imports: [CommonModule,MatIconModule],
  templateUrl: './quizmodal.component.html',
  styleUrl: './quizmodal.component.scss'
})
export class QuizmodalComponent {

  constructor(
    public dialogRef:MatDialogRef<QuizmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public quiz:any
  ){}

  close():void{
    this.dialogRef.close()
  }

}
