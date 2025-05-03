import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-courselist',
  imports: [CommonModule,RouterModule],
  templateUrl: './courselist.component.html',
  styleUrl: './courselist.component.scss'
})
export class CourselistComponent implements OnInit{

  @Input() courses:any[]=[]
  @Input() selectedCourseId:string=''
  @Input() userType:'student'|'instructor'='student'
  @Output() courseSelected=new EventEmitter<string>()

  ngOnInit():void{
    //if courses are available and no course is selected,select the first one
    if(this.courses.length>0&& !this.selectedCourseId){
      this.selectCourse(this.courses[0]._id)
    }
  }

  selectCourse(courseId:string):void{
    this.selectedCourseId=courseId
    this.courseSelected.emit(courseId)
  }
  
}
