import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-studentquizresult',
  imports: [CommonModule,MatIconModule,MatButtonModule],
  templateUrl: './studentquizresult.component.html',
  styleUrl: './studentquizresult.component.scss'
})
export class StudentquizresultComponent {
     
  constructor(
    public dialogRef:MatDialogRef<StudentquizresultComponent>,
    @Inject(MAT_DIALOG_DATA) public quiz:any
  ){}


  closeDialog():void{
    this.dialogRef.close()
  }


  getScoreClass(score: number): string {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }


   getOptionClass(questionIndex: number, optionIndex: number): string {
    const question = this.quiz.questions[questionIndex];
    
    if (question.correctAnswer === optionIndex) {
      return 'bg-green-100 text-green-800';
    }
    
    if (question.userAnswer === optionIndex && question.correctAnswer !== optionIndex) {
      return 'bg-red-100 text-red-800';
    }
    
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}
