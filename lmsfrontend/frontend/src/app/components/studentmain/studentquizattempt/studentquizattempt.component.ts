import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationcomponentComponent } from '../../common/confirmationcomponent/confirmationcomponent.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-studentquizattempt',
  imports: [CommonModule,MatIconModule],
  templateUrl: './studentquizattempt.component.html',
  styleUrl: './studentquizattempt.component.scss'
})
export class StudentquizattemptComponent {
    selectedAnswers:number[]=[]

    constructor(
      public dialogRef:MatDialogRef<StudentquizattemptComponent>,
      @Inject(MAT_DIALOG_DATA) public quiz:any,
      private dialog:MatDialog
    ){

      if(this.quiz&& this.quiz.questions){
        this.selectedAnswers=new Array(this.quiz.questions.length).fill(-1)
      }
    }


    selectAnswer(questionIndex:number,optionIndex:number):void{
        this.selectedAnswers[questionIndex]=optionIndex
    }

    getAnsweredCount():number{
      return this.selectedAnswers.filter(answer=>answer!==-1).length
    }

    isAllQuestionsAnswered():boolean{
      return this.selectedAnswers.every(answer=>answer!==-1)
    }



    submitQuiz():void{
      if(!this.isAllQuestionsAnswered()){
        return
      }

      const confirmDialogRef=this.dialog.open(ConfirmationcomponentComponent,{
          data:{
            title:'Submit Quiz',
            message:'Are you sure you want to submit this quiz?',
            confirmText:'Submit',
            cancelText:'Cancel'
          }
      })

      confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close({
            quizId: this.quiz._id,
            answers: this.selectedAnswers,
            questions: this.quiz.questions
          });
        }
      });
    }


    confirmClose(): void {
      if (this.getAnsweredCount() > 0) {
        const confirmDialog = this.dialog.open(ConfirmationcomponentComponent, {
          data: {
            title: 'Exit Quiz',
            message: 'Are you sure you want to exit? Your progress will be lost.',
            confirmText: 'Exit',
            cancelText: 'Stay'
          }
        });
  
        confirmDialog.afterClosed().subscribe(result => {
          if (result) {
            this.dialogRef.close();
          }
        });
      } else {
        this.dialogRef.close();
      }
    }



}
