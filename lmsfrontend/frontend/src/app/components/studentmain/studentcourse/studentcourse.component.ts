import { Component, OnInit } from '@angular/core';
import { StudentcourseService } from '../../../services/studentservice/course/studentcourse.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-studentcourse',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './studentcourse.component.html',
  styleUrl: './studentcourse.component.scss'
})
export class StudentcourseComponent implements OnInit{

  courses:any[]=[]
  loading:boolean=false
  error:string=''
  searchTerm:string=''
  filteredCourses:any[]=[]

  constructor(private studentService:StudentcourseService,private snackBar:MatSnackBar,private router:Router){}

  ngOnInit():void{
    this.loadCourses()
  }

  loadCourses(){
    this.loading=true
    this.studentService.getAllCourses().subscribe(
      response=>{
        console.log('couses ellam load aayi',response)
        this.courses=response
        console.log('normal courses',this.courses)
        this.filteredCourses=[...this.courses]
        console.log('Filtered Courses:', this.filteredCourses); 
        this.loading=false
      },
      error=>{
        this.error='Failed to load courses'
        this.loading=false
        console.error('Error loading courses',error)
      }
    )
  }


  //gonna have search
  onSearch(){
    if(!this.searchTerm.trim()){
      this.filteredCourses=[...this.courses]
      return
    }
    const searchTermLower=this.searchTerm.toLowerCase()
    this.filteredCourses=this.courses.filter(course=>{
      return  course.title.toLowerCase().includes(searchTermLower)||
      course.instructor?.name.toLowerCase().includes(searchTermLower)||
      course.category.toLowerCase().includes(searchTermLower)
    })
  }


  enrollCourse(courseId:string){
    // this.loading=true
    // this.studentService.enrollCourse(courseId).subscribe(
    //   response=>{
    //     this.snackBar.open('Successfully enrolled in the course!','Close',{
    //       duration:3000,
    //       horizontalPosition:'right',
    //       verticalPosition:'top'
    //     })
    //     console.log('course enrolled successfully')
    //     this.router.navigate(['/student/my-courses'])
    //   },
    //   error=>{
    //     console.log('enrollement failed',error)
    //   }
    // )
  }


}
