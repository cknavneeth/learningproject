import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstructorcourseService } from '../../../services/instructorservice/course/instructorcourse.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTable } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Review } from '../../../interfaces/review.interface';
import { MatDialog } from '@angular/material/dialog';
import { InstructorreplydialogComponent } from '../instructorreplydialog/instructorreplydialog.component';
import { ReviewService } from '../../../services/studentservice/review/review.service';

@Component({
  selector: 'app-coursedetail',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  templateUrl: './coursedetail.component.html',
  styleUrl: './coursedetail.component.scss'
})
export class CoursedetailComponent {
  courseId: string = '';
  courseDetails: any = null;
  loading: boolean = true;
  error: string = '';
  stats: any = null;
  reviews: any[] = [];
  enrollmentChart: any;
  revenueChart: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: InstructorcourseService,
    private snackBar: MatSnackBar,
    private dialog:MatDialog,
    private reviewService:ReviewService
  ) {}



  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    if (this.courseId) {
      this.loadCourseDetails();
    } else {
      this.error = 'Course ID not found';
      this.loading = false;
    }
  }


  loadCourseDetails(): void {
    this.courseService.getCourseDetailsForInstructor(this.courseId).subscribe(
      (response) => {
        this.courseDetails = response.course;
        console.log('instructorde course detail ahney athum course detail pagil',this.courseDetails)
        this.stats = response.stats;
        console.log('stats ahney',this.stats)
        this.reviews = response.reviews;
        this.loading = false;
        
        // Initialize charts after data is loaded
        setTimeout(() => {
          this.initEnrollmentChart();
          this.initRevenueChart();
        }, 100);
      },
      (error) => {
        this.error = 'Failed to load course details';
        this.loading = false;
        this.snackBar.open('Error loading course details', 'Close', {
          duration: 3000
        });
      }
    )
  }


  getAverageRating(): number {
    if (!this.reviews || this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }

  goBack(): void {
    this.router.navigate(['/instructor/my-courses']);
  }



  initEnrollmentChart(): void {
    const ctx = document.getElementById('enrollmentChart') as HTMLCanvasElement;
    if (ctx) {
      // Use the data from the API
      const labels = this.stats?.monthLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const data = this.stats?.enrollmentTrend || [0, 0, 0, 0, 0, 0];
      
      this.enrollmentChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Enrollments',
            data: data,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0 // Only show whole numbers
              }
            }
          }
        }
      });
    }
  }

  initRevenueChart(): void {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (ctx) {
      // Use the data from the API
      const labels = this.stats?.monthLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const data = this.stats?.revenueTrend || [0, 0, 0, 0, 0, 0];
      
      this.revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Revenue (Rs)',
            data: data,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }



  //add method to open reply dialog
  openReplyDialog(review:Review):void{
    const dialogRef=this.dialog.open(
      InstructorreplydialogComponent,{
        width:'500px',
        data:{review}
      }
    )


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reviewService.addInstructorReply(review._id, result.instructorReply).subscribe({
          next: (updatedReview) => {
            // Update the review in the list
            const index = this.reviews.findIndex(r => r._id === review._id);
            if (index !== -1) {
              this.reviews[index] = updatedReview;
            }
            this.snackBar.open('Reply added successfully', 'Close', { duration: 3000 });
          },
           error: (error) => {
            this.snackBar.open('Failed to add reply', 'Close', { duration: 3000 });
            console.error('Error adding reply:', error);
          }
        });
      }
    });
  }
  
}
