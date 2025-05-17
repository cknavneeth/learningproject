import { Component, OnInit } from '@angular/core';
import { StudentcourseService } from '../../../services/studentservice/course/studentcourse.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { CourselistComponent } from '../../../shared/courselist/courselist.component';
import { CommunitychatComponent } from '../../../shared/communitychat/communitychat.component';
import { MatIconModule } from '@angular/material/icon';
import { CommunityService } from '../../../services/communityservice/community.service';

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
    private snackBar:MatSnackBar,
    private communityService:CommunityService
  ){}

  ngOnInit():void{
    this.loadEnrolledCourses()

    //initialize unread counts
    this.communityService.initUnreadCounts()
  }

  loadEnrolledCourses():void{
    this.loading=true
    this.studentCourseService.getEnrolledCourses().subscribe(
      response=>{
        this.enrolledCourses=response.courses||[]
        this.loading=false
        console.log('enrolled courses for student',this.enrolledCourses)

        //select the first course by default if available
        if(this.enrolledCourses.length>0){
          this.selectedCourseId=this.enrolledCourses[0]._id
        }
        console.log('selected course id',this.selectedCourseId)
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


    const currentCounts = this.communityService.getUnreadCountsValue();
  if (currentCounts && currentCounts[courseId]) {
    const updatedCounts = { ...currentCounts };
    delete updatedCounts[courseId];
    this.communityService.updateUnreadCounts(updatedCounts);
  }
  }


   ngOnDestroy(): void {
    // Clean up
    this.communityService.clearUnreadCountsInterval();
  }


  // Add this method to the StudentcommunityComponent class
getSelectedCourseName(): string {
  const selectedCourse = this.enrolledCourses.find(course => course._id === this.selectedCourseId);
  return selectedCourse?.title || 'Course';
}

}
