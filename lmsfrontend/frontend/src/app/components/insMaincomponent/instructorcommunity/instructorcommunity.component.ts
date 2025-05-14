import { Component, OnInit } from '@angular/core';
import { InstructorcourseService } from '../../../services/instructorservice/course/instructorcourse.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { CourselistComponent } from '../../../shared/courselist/courselist.component';
import { CommunitychatComponent } from '../../../shared/communitychat/communitychat.component';
import { MatIconModule } from '@angular/material/icon';
import { CommunityService } from '../../../services/communityservice/community.service';

@Component({
  selector: 'app-instructorcommunity',
  imports: [CommonModule,CourselistComponent,CommunitychatComponent,MatIconModule],
  templateUrl: './instructorcommunity.component.html',
  styleUrl: './instructorcommunity.component.scss'
})
export class InstructorcommunityComponent implements OnInit{

  instructorCourses:any[]=[]
  selectedCourseId:string=''
  loading:boolean=true
  error:string=''

  constructor(private instructorCourseService:InstructorcourseService,private snackBar:MatSnackBar,private communityService:CommunityService){}

  ngOnInit():void{
    this.loadInstructorCourses()

    //initialize unread counts
    this.communityService.initUnreadCounts()
  }

  loadInstructorCourses():void{
    this.loading=true
    this.instructorCourseService.getCourses().subscribe(
      respones=>{
        this.instructorCourses=respones.data.courses||[]
        console.log('community for instructors',this.instructorCourses)
        this.loading=false

        //select the first course by default if available
        if(this.instructorCourses.length>0){
          this.selectedCourseId=this.instructorCourses[0]._id
        }
      },
      error=>{
        this.error='Failed to load instructor courses'
        this.snackBar.open(this.error,'Close',{duration:3000})
        this.loading=false
      }
    )
  }


  onCourseSelected(courseId:string):void{
    this.selectedCourseId=courseId
  }


   ngOnDestroy(): void {
    // Clean up
    this.communityService.clearUnreadCountsInterval();
  }
}
