import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentcourseService } from '../../../services/studentservice/course/studentcourse.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-course-detail',
  imports: [ 
    CommonModule, 
    MatProgressSpinnerModule,
    MatExpansionModule ,
    MatIconModule
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent {

  courseDetails:any
  loading:boolean=false
  error:string=''

  constructor(private route:ActivatedRoute,private studentCourseService:StudentcourseService){}

  ngOnInit():void{
    this.loading=true
   const courseId=this.route.snapshot.paramMap.get('id')

    if(courseId){
      this.studentCourseService.getCourseById(courseId).subscribe(
        response=>{
          this.courseDetails=response
          this.loading=false
        },
        error=>{
          this.error='Failed to load course details'
          this.loading=false
        }
      )
    }
  }



  getTotalLectures(): number {
    return this.courseDetails?.sections?.reduce((total: number, section: any) => 
      total + (section.resources?.length || 0) + 1, 0) || 0;
  }

  getTotalDuration(): string {
    const totalMinutes = this.courseDetails?.sections?.reduce((total: number, section: any) => 
      total + (section.duration || 0), 0) || 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }
}
