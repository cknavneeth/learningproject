import { Component, OnInit } from '@angular/core';
import { TableColumn, TablecomponentComponent } from '../../../shared/tablecomponent/tablecomponent.component';
import { AdminserviceService } from '../../../services/adminservice.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CoursedetailmodalComponent } from '../coursedetailmodal/coursedetailmodal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddCourseOfferComponent } from '../add-course-offer/add-course-offer.component';
import { ConfirmationcomponentComponent } from '../../common/confirmationcomponent/confirmationcomponent.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';



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
  imports: [CommonModule,MatDialogModule,FormsModule,MatIconModule , MatTooltipModule ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit{

  Math = Math; 
  error:string=''
  loading:boolean=false
  filteredCourses:any[]=[]
  searchTerm:string=''


  courses:any[]=[]


  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;



  constructor(private adminService:AdminserviceService,private dialogue:MatDialog,private snackBar:MatSnackBar){}

  ngOnInit():void{
    console.log('courses are initialized')
    this.loadCourses()
  }

  loadCourses(){
    this.loading=true
    this.adminService.getAllCourses(this.currentPage,this.itemsPerPage).subscribe(
      response=>{
        console.log('coursinte response',response)
        this.courses=response.courses
        console.log('Course with instructor:', this.courses[0]);

        this.filteredCourses=[...this.courses]
        this.totalItems = response.pagination.total;
        this.totalPages = response.pagination.totalPages;
        this.loading=false
      },
      error=>{
        console.error('Error loading courses',error)
      }
    )
  }


  onPageChange(page: number) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCourses();
    }
  }

  // handleTableAction(event:{action:string,item:any}){
  //   switch(event.action){
  //     case 'approve':
  //       this.approveCourse(event.item._id);
  //       break;
  //     case 'reject':
  //       this.rejectCourse(event.item._id);
  //       break;
  //     case 'view':
  //      this.viewCourseDetails(event.item._id);
  //      break;
  //      case 'verify':  // Add this case
  //       this.viewCourseDetails(event.item._id);
  //       break;
  //   }
  // }

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

  rejectCourse(courseId:string,feedback:string){
    this.adminService.rejectCourse(courseId,feedback).subscribe(
      response=>{
        this.snackBar.open('Course rejected and feedback sent', 'Close', {
          duration: 3000
        });
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
              this.rejectCourse(courseId,result.feedback)
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



  getPageNumbers(): number[] {
    const maxPages = 5;
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
  
    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  
    let startPage = Math.max(currentPage - Math.floor(maxPages / 2), 1);
    let endPage = startPage + maxPages - 1;
  
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPages + 1, 1);
    }
  
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }



  manageOffer(course: any) {
    if (course.offer) {
        // If offer exists, show confirmation dialog for removal
        const dialogRef = this.dialogue.open(ConfirmationcomponentComponent, {
            data: {
                title: 'Remove Offer',
                message: `Are you sure you want to remove the ${course.offer.percentage}% offer from "${course.title}"?`
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.adminService.removeCourseOffer(course._id).subscribe({
                    next: () => {
                        this.loadCourses();
                        this.snackBar.open('Offer removed successfully', 'Close', {
                            duration: 3000,
                            horizontalPosition: 'right',
                            verticalPosition: 'top'
                        });
                    },
                    error: (error) => {
                        this.snackBar.open(error.error.message || 'Failed to remove offer', 'Close', {
                            duration: 3000,
                            horizontalPosition: 'right',
                            verticalPosition: 'top'
                        });
                    }
                });
            }
        });
    } else {
        // If no offer exists, open dialog to add offer
        const dialogRef = this.dialogue.open(AddCourseOfferComponent, {
            width: '500px',
            data: {
                courseId: course._id,
                courseTitle: course.title,
                price: course.price
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadCourses();
                this.snackBar.open('Offer added successfully', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top'
                });
            }
        });
    }
}

}
