import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommunityService } from '../../services/communityservice/community.service';

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

  unreadMessageCounts:Record<string,number>={}
  private unreadCountsSubscription?:Subscription

  constructor(private communityService:CommunityService){}

  ngOnInit():void{
    //if courses are available and no course is selected,select the first one
    if(this.courses.length>0&& !this.selectedCourseId){
      this.selectCourse(this.courses[0]._id)
    }

    this.unreadCountsSubscription=this.communityService.getUnreadCountsObservable().subscribe(counts=>{
      this.unreadMessageCounts=counts
    })
  }

  selectCourse(courseId:string):void{
    this.selectedCourseId=courseId
    this.courseSelected.emit(courseId)
  }


   ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.unreadCountsSubscription) {
      this.unreadCountsSubscription.unsubscribe();
    }
  }


  getUnreadCount(courseId: string): number {
    return this.unreadMessageCounts[courseId] || 0;
  }
  
}
