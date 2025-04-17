import { Component } from '@angular/core';
import { InstructorcourseService } from '../../../services/instructorservice/course/instructorcourse.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

type CourseStatus='pending_review' | 'published' | 'rejected'
interface StatusClasses{
  [key:string]:string,
  pending_review:string,
  published:string,
  rejected:string
}

@Component({
  selector: 'app-my-courses',
  imports: [CommonModule, MatPaginatorModule,RouterModule],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.scss'
})
export class MyCoursesComponent {
     courses:any[]=[]
     loading:boolean=false
     error=''

     currentPage=1
     itemsPerPage=6
     totalItems=0
     totalPages=0

     private readonly statusClasses: StatusClasses = {
      'pending_review': 'bg-yellow-100 text-yellow-800',
      'published': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };

     constructor(private instructorService:InstructorcourseService,
      private snackBar:MatSnackBar,
      private router:Router
     ){}

     ngOnInit():void{
      this.loadCourses()
     }

     loadCourses():void{
      this.loading=true
      this.instructorService.getCourses(this.currentPage,this.itemsPerPage).subscribe(
        response=>{
          if (response && response.data) {
            this.courses = response.data.courses;
            this.totalItems = response.data.pagination.total;
            this.totalPages = response.data.pagination.totalPages;
        } else {
            this.courses = [];
            this.totalItems = 0;
            this.totalPages = 0;
        }
        this.loading = false;
          console.log('instructorde courses ahn ith',this.courses)
        },
        error=>{
          this.error='Failed to load courses'
          this.snackBar.open(this.error,'Close',{duration:3000})
        }
      )
     }

     handlePageEvent(event:PageEvent):void{
      this.currentPage=event.pageIndex+1
      this.itemsPerPage=event.pageSize
      this.loadCourses()
     }

     getStatusClass(status: CourseStatus): string {
      return this.statusClasses[status] || 'bg-gray-100 text-gray-800';
    }


}
