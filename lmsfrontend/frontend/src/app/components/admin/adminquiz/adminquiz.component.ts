import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuizService } from '../../../services/adminservice/quiz/quiz.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { QuizmodalComponent } from '../quizmodal/quizmodal.component';

@Component({
  selector: 'app-adminquiz',
  imports: [CommonModule,ReactiveFormsModule,MatIconModule,MatTooltipModule,MatProgressSpinnerModule],
  templateUrl: './adminquiz.component.html',
  styleUrl: './adminquiz.component.scss'
})
export class AdminquizComponent {
    quizForm:FormGroup

    quizzes:any[]=[]
    isGenerating:boolean=false
    isLoading:boolean=false
    isSubmitting:boolean=false
    isHistoryLoading:boolean=false
    isHistoryError:boolean=false
    isHistoryEmpty:boolean=false

    constructor(
      private fb:FormBuilder,
      private quizService:QuizService,
      private snackBar:MatSnackBar,
      private dialog:MatDialog

    ){
      this.quizForm=this.fb.group({
        topic:['',[Validators.required,Validators.minLength(3)]]
      })
    }


    ngOnInit():void{
      this.loadQuiz()
    }

    loadQuiz():void{
      this.isLoading=true
      this.quizService.getAllQuizzes().subscribe({
        next:(data)=>{
          this.quizzes=data
          console.log('quiz history',this.quizzes)
          this.isLoading=false
          this.snackBar.open('Quiz history loaded successfully','Close',{
            duration:3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          })
        },
        error:(error)=>{
          this.snackBar.open('Failed to load quiz history','Close',{
            duration:3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          })
        }
      })
    }

    generateQuiz():void{
      if(this.quizForm.invalid){
        return
      }

      this.isGenerating=true
      const topic=this.quizForm.get('topic')?.value

      this.quizService.generateQuiz(topic).subscribe(
        response=>{
          this.snackBar.open('Quiz generated successfully','Close',{
            duration:3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          })
          this.isGenerating=false
          this.quizForm.reset()
        },
        error=>{
          this.snackBar.open('Failed to generate quiz','Close',{
            duration:3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          })
          this.isGenerating=false
        }
      )
    }


    getScoreClass(score: number): string {
      if (score >= 80) return 'bg-green-100 text-green-800';
      if (score >= 60) return 'bg-blue-100 text-blue-800';
      if (score >= 40) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    }
  
    formatDate(dateString: string): string {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }


    openQuizModal(quiz:any):void{
      const dialogRef=this.dialog.open(QuizmodalComponent,{
          width:'800px',
          data:quiz
      })
    }
}
