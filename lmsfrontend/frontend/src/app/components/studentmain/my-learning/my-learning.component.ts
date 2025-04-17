import { Component, OnInit } from '@angular/core';
import { StudentcourseService } from '../../../services/studentservice/course/studentcourse.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { EnrolledCourse } from '../../../interfaces/mylearning.interface';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-my-learning',
  imports: [CommonModule,MatProgressSpinnerModule,MatPaginatorModule],
  templateUrl: './my-learning.component.html',
  styleUrl: './my-learning.component.scss'
})
export class MyLearningComponent implements OnInit {
      enrolledCourses:EnrolledCourse[]=[]
      loading:boolean=false
      error:string=''


      //pagination properties
      currentPage:number=1
      itemsPerPage:number=10
      totalItems:number=0
      totalPages:number=0

      constructor(
        private studentService:StudentcourseService,
        private router:Router,
        private snackBar:MatSnackBar
      ){}

      ngOnInit():void{
        this.loadEnrolledCourses()
      }

      loadEnrolledCourses():void{
        this.loading=true
        this.studentService.getEnrolledCourses(this.currentPage,this.itemsPerPage).subscribe(
          response=>{
            console.log('enrolled courses',response)
            this.enrolledCourses=response.courses||[]
            this.loading=false
            this.totalItems=response.pagination.total
            this.totalPages=response.pagination.totalPages
          },
          error=>{
            this.error='failed to load enrolled courses'
            this.loading=false
            this.snackBar.open(this.error,'Close',{duration:3000})
          }
        )
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
}
