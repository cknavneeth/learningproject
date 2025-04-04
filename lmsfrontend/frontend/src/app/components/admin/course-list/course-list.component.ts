import { Component } from '@angular/core';
import { TableColumn, TablecomponentComponent } from '../../../shared/tablecomponent/tablecomponent.component';
import { AdminserviceService } from '../../../services/adminservice.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CoursedetailmodalComponent } from '../coursedetailmodal/coursedetailmodal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



type CourseStatus = 'pending_review' | 'published' | 'rejected';

// Define interfaces for type safety
interface StatusClasses {
  pending_review: string;
  published: string;
  rejected: string;
}

interface StatusTexts {
  pending_review: string;
  published: string;
  rejected: string;
}


@Component({
  selector: 'app-course-list',
  imports: [CommonModule,MatDialogModule,FormsModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent {

  error:string=''
  loading:boolean=false
  filteredCourses:any[]=[]
  searchTerm:string=''


  courses:any[]=[]




  constructor(private adminService:AdminserviceService,private dialogue:MatDialog){}

  ngOnInit():void{
    console.log('courses are initialized')
    this.loadCourses()
  }

  loadCourses(){
    this.adminService.getAllCourses().subscribe(
      response=>{
        console.log('coursinte response',response)
        this.courses=response
        this.filteredCourses=[...this.courses]
      },
      error=>{
        console.error('Error loading courses',error)
      }
    )
  }

  handleTableAction(event:{action:string,item:any}){
    switch(event.action){
      case 'approve':
        this.approveCourse(event.item._id);
        break;
      case 'reject':
        this.rejectCourse(event.item._id);
        break;
      case 'view':
       this.viewCourseDetails(event.item._id);
       break;
       case 'verify':  // Add this case
        this.viewCourseDetails(event.item._id);
        break;
    }
  }

  approveCourse(courseId:string){
    this.adminService.approveCourse(courseId).subscribe(
      response=>{
        this.loadCourses()
      },
      error=>{
        console.error('Error approving course',error)
      }
    )
  }

  rejectCourse(courseId:string){
    this.adminService.rejectCourse(courseId).subscribe(
      response=>{
        this.loadCourses()
      },
      error=>{
        console.error('Error rejecting course',error) 
      }
    )
  }


  viewCourseDetails(courseId:string){
    const course=this.courses.find(c=>c._id===courseId)
    console.log('course details',course)

    if(course){
      const dialogRef=this.dialogue.open(CoursedetailmodalComponent,{
        width:'800px',
        maxWidth:'90vw',
        maxHeight:'90vh',
        data:course,
        panelClass:'course-details-modal'
      })

      dialogRef.afterClosed().subscribe(
        result=>{
          if(result){
            if(result.action==='approve'){
              this.approveCourse(courseId)
            }else if (result.action==='reject'){
              this.rejectCourse(courseId)
            }
          }
        }
      )
    }
  }




  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredCourses = [...this.courses];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(course => 
      course.title.toLowerCase().includes(searchTermLower) ||
      course.instructor?.name.toLowerCase().includes(searchTermLower) ||
      course.category.toLowerCase().includes(searchTermLower)
    );
  }




  getStatusClass(status: CourseStatus): string {
    const statusClasses = {
      'pending_review': 'bg-yellow-100 text-yellow-800',
      'published': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusText(status: CourseStatus): string {
    const statusTexts = {
      'pending_review': 'Pending Review',
      'published': 'Published',
      'rejected': 'Rejected'
    };
    return statusTexts[status] || status;
  }

}
