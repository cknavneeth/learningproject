import { AfterViewInit, Component, OnInit } from '@angular/core';
import { StudentcourseService } from '../../../services/studentservice/course/studentcourse.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { EnrolledCourse } from '../../../interfaces/mylearning.interface';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CourseCancellationModalComponent } from '../course-cancellation-modal/course-cancellation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { ReviewService } from '../../../services/studentservice/review/review.service';
import { Review } from '../../../interfaces/review.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-my-learning',
  imports: [CommonModule, MatProgressSpinnerModule, MatPaginatorModule, MatIconModule, 
    MatTooltipModule,
    RouterModule],
  templateUrl: './my-learning.component.html',
  styleUrl: './my-learning.component.scss'
})
export class MyLearningComponent implements OnInit ,AfterViewInit{
      enrolledCourses: EnrolledCourse[] = [];
      loading: boolean = false;
      error: string = '';


      //pagination properties
      currentPage:number=1
      itemsPerPage:number=10
      totalItems:number=0
      totalPages:number=0

      courseReviews:{[courseId:string]:Review}={}

      userReviews:{[courseId:string]:Review}={}

      constructor(
        private studentService:StudentcourseService,
        private router:Router,
        private snackBar:MatSnackBar,
        private dialog:MatDialog,
        private reviewService:ReviewService
      ){}

      ngOnInit():void{
        this.loadEnrolledCourses()
        // this.loadUserReviews()
      }



      ngAfterViewInit(): void {
        // Initialize circular progress after view is initialized
        setTimeout(() => {
          this.updateCircularProgress();
        }, 500);
      }
    
      // Update circular progress CSS variables
      updateCircularProgress(): void {
        const circles = document.querySelectorAll('.progress-circle');
        circles.forEach(circle => {
          const progress = circle.getAttribute('data-progress');
          if (progress) {
            (circle as HTMLElement).style.setProperty('--progress', progress);
          }
        });
      }



      loadEnrolledCourses(): void {
        this.loading = true;
        this.studentService.getEnrolledCourses(this.currentPage, this.itemsPerPage).subscribe({
          next: (response) => {
            this.enrolledCourses = response.courses.map((course: EnrolledCourse) => ({
              ...course,
              purchaseDate: new Date(course.purchaseDate)
            }));
            this.loading = false;
            this.totalItems = response.pagination.total;
            this.totalPages = response.pagination.totalPages;


            this.loadUserReviewsForCourses()

            setTimeout(() => {
              this.updateCircularProgress();
            }, 100);
          },
          error: (error) => {
            this.error = 'failed to load enrolled courses';
            this.loading = false;
            this.snackBar.open(this.error, 'Close', {duration: 3000});
          }
        });
        
      }

      continueLearning(courseId:string):void{
        console.log('button njengiyo')
        this.router.navigate(['/student/course-player',courseId])
      }

      handlePageEvent(event: PageEvent): void {
        this.currentPage = event.pageIndex + 1;
        this.itemsPerPage = event.pageSize;
        this.loadEnrolledCourses();
      }


      isWithin30Minutes(purchaseDate: Date): boolean {
        if (!purchaseDate) return false;
        
        // Force current time to be actual current time
        const currentTime = new Date();
        const purchaseTime = new Date(purchaseDate);
        const minutesSincePurchase = (currentTime.getTime() - purchaseTime.getTime()) / (1000 * 60);
        return minutesSincePurchase <= 30;
      }


      requestCancellation(course: EnrolledCourse): void {
        // Single check for cancellation eligibility
        const isEligible = this.isWithin30Minutes(course.purchaseDate);
        
        if (!isEligible) {
          this.snackBar.open('Course cancellation is only available within 24 hours of purchase', 'Close', {
            duration: 5000
          });
          return;
        }

        const dialogRef = this.dialog.open(CourseCancellationModalComponent, {
          width: '500px',
          data: {
            courseId: course._id,
            courseName: course.title,
            purchaseDate: course.purchaseDate,
            isEligible
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result?.confirmed) {
            this.studentService.requestCourseCancellation(course._id, result.reason).subscribe({
              next: () => {
                this.snackBar.open('Cancellation request sent successfully', 'Close', {duration: 3000});
                this.loadEnrolledCourses();
              },
              error: (error) => {
                this.snackBar.open(error.error?.message || 'Failed to send cancellation request', 'Close', {duration: 3000});
              }
            });
          }
        });
      }



      openReviewDialog(courseId:string):void{
        const existingReview=this.userReviews[courseId]
        const dialogRef=this.dialog.open(ReviewDialogComponent,{
          width:'500px',
          data:{
            courseId,
            isEdit:!!existingReview,
            review:existingReview
          }
        })

        dialogRef.afterClosed().subscribe(result=>{
          if(result){
            if (existingReview) {
              // Update existing review
              this.reviewService.updateReview(existingReview._id, result).subscribe({
                next: (response) => {
                  this.snackBar.open('Review updated successfully', 'Close', {duration: 3000});
                  // Update the local review data
                  this.userReviews[courseId] = response;
                  this.loadEnrolledCourses();
                },
                error: (error) => {
                  this.snackBar.open('Failed to update review', 'Close', {duration: 3000});
                }
              });
            }else {
              // Create new review
              this.reviewService.createReview(courseId, result).subscribe({
                next: (response) => {
                  this.snackBar.open('Review submitted successfully', 'Close', {duration: 3000});
                  // Update the local review data
                  this.userReviews[courseId] = response;
                  this.loadEnrolledCourses();
                },
                error: (error) => {
                  this.snackBar.open('Failed to submit review', 'Close', {duration: 3000});
                }
              });
            }

         }
      })
      }


//for editing reviews
    loadUserReviewsForCourses():void{
      if(!this.enrolledCourses||this.enrolledCourses.length===0){
        return
      }

      this.enrolledCourses.forEach(course => {
        this.reviewService.getUserReviewForCourse(course._id).subscribe({
          next: (review) => {
            if (review) {
              console.log('ella reviewm kannallo',review)
              this.userReviews[course._id] = review;
            }
          },
          error: (error) => {
            console.error(`Error loading user review for course ${course._id}:`, error);
          }
        });
      });

    }
     
}
