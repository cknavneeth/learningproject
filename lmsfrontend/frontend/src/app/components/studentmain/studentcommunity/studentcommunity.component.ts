import { Component, OnInit } from '@angular/core';
import { StudentcourseService } from '../../../services/studentservice/course/studentcourse.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { CourselistComponent } from '../../../shared/courselist/courselist.component';
import { CommunitychatComponent } from '../../../shared/communitychat/communitychat.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-studentcommunity',
  imports: [CommonModule,CourselistComponent,CommunitychatComponent,MatIconModule],
  templateUrl: './studentcommunity.component.html',
  styleUrl: './studentcommunity.component.scss'
})
export class StudentcommunityComponent implements OnInit{

  enrolledCourses:any[]=[]
  selectedCourseId:string=''
  loading:boolean=true
  error:string=''

  constructor(
    private studentCourseService:StudentcourseService,
    private snackBar:MatSnackBar
  ){}

  ngOnInit():void{
    this.loadEnrolledCourses()
  }

  loadEnrolledCourses():void{
    this.loading=true
    this.studentCourseService.getEnrolledCourses().subscribe(
      response=>{
        this.enrolledCourses=response.courses||[]
        this.loading=false

        //select the first course by default if available
        if(this.enrolledCourses.length>0){
          this.selectedCourseId=this.enrolledCourses[0]._id
        }
      },
      error=>{
        this.error='Failed to load enrolled courses'
        this.snackBar.open(this.error,'Close',{duration:3000})
        this.loading=false
      }
    )
  }

  onCourseSelected(courseId:string):void{
    this.selectedCourseId=courseId
  }
}
