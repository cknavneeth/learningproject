import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../../services/adminservice/quiz/quiz.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenserviceService } from '../../../services/tokenservice.service';
import { StudentquizattemptComponent } from '../studentquizattempt/studentquizattempt.component';
import { StudentquizresultComponent } from '../studentquizresult/studentquizresult.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-studentquiz',
  imports: [CommonModule,MatIconModule,MatProgressSpinnerModule],
  templateUrl: './studentquiz.component.html',
  styleUrl: './studentquiz.component.scss'
})
export class StudentquizComponent implements OnInit{
   
  quizzes:any[]=[]
  quizHistory:any[]=[]
  isLoading:boolean=false
  isHistoryLoading:boolean=false
  userId:string=''

  constructor(
   private quizService:QuizService,
   private snackBar:MatSnackBar,
   private dialog:MatDialog,
   private authService:TokenserviceService
  ){}

  ngOnInit(): void {
      this.loadQuizzes()
      this.loadQuizHistory()
  }

  loadQuizzes():void{
    this.isLoading = true;
    this.quizService.getAllQuizzes().subscribe({
      next:(data) => {
        this.quizzes = data;
        // Make sure isSubmitted is properly set for each quiz
        console.log('all the quizzes for the student', this.quizzes);
        this.isLoading = false;
      },
      error:(error) => {
        this.snackBar.open('Failed to load quizzes', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['dark-snackbar']
        });
        this.isLoading = false;
      }
    });
  }


  loadQuizHistory():void{
    this.isHistoryLoading=true
    this.quizService.getQuizHistory().subscribe(
      data=>{
        this.quizHistory=data;
        console.log('quiz historyum koode nokkte',this.quizHistory)
        this.isHistoryLoading=false
      },
      error=>{
        this.snackBar.open('Failed to load quiz history','Close',{duration:3000,horizontalPosition:'right',verticalPosition:'top'})
        this.isHistoryLoading=false
      }
    )
  }


  openQuizAttemptModal(quiz:any):void{
    if (this.isQuizSubmitted(quiz._id)) {
      this.snackBar.open('You have already submitted this quiz', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      return;
    }

    const dialogRef = this.dialog.open(StudentquizattemptComponent, {
      width: '800px',
      data: quiz,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('modal closed aftre submiting quiz',result)
        this.submitQuiz(result.quizId, result.answers, result.questions);
      }
    });
  }


  submitQuiz(quizId: string, answers: number[], questions: any[]): void {
    this.quizService.submitQuiz(quizId, answers, questions).subscribe({
      next: (response) => {
        this.snackBar.open('Quiz submitted successfully', 'Close', {
          duration: 3000
        });
        this.loadQuizzes();
        this.loadQuizHistory();
      },
      error: (error) => {
        this.snackBar.open('Failed to submit quiz', 'Close', {
          duration: 3000
        });
      }
    });
  }

  viewQuizResult(quiz: any): void {
    const dialogRef = this.dialog.open(StudentquizresultComponent, {
      width: '800px',
      data: quiz
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }


  isQuizSubmitted(quizId: string): boolean {
    if (!this.quizHistory || this.quizHistory.length === 0) {
      return false;
    }
    
  
   // Debug the issue
  console.log('Checking if quiz is submitted:', quizId);
  console.log('Quiz history:', this.quizHistory);
  
  // Find the matching quiz in history
  const matchingQuiz = this.quizHistory.find(historyQuiz => 
    historyQuiz.originalQuizId === quizId
  );
  
  console.log('Matching quiz found:', matchingQuiz);
  
  return !!matchingQuiz;
  }
  


  scrollToQuizzes(): void {
    const quizzesSection = document.querySelector('.available-quizzes');
    if (quizzesSection) {
      quizzesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
