import { Component, OnInit } from '@angular/core';
import { instructors } from '../../../interfaces/auth.interface';
import { AdminserviceService } from '../../../services/adminservice.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationcomponentComponent } from '../../common/confirmationcomponent/confirmationcomponent.component';
import { InstructorverificationModalComponent } from '../instructorverification-modal/instructorverification-modal.component';

@Component({
  selector: 'app-instructor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructor-list.component.html',
  styleUrl: './instructor-list.component.scss'
})
export class InstructorListComponent implements OnInit{
   instructors:instructors[]=[]

   constructor(private authservice: AdminserviceService,private dialoag:MatDialog){}

   ngOnInit(): void {
    this.loadInstructors()
    
   }

   loadInstructors(): void {
    this.authservice.fetchInstructors().subscribe({
      next: (data) => {
        this.instructors = Array.isArray(data) ? data : [data];
      },
      error: (error) => {
        console.error('Error loading instructors:', error);
      }
    });
}

   toggleBlock(instructor: instructors) {
    const action=instructor.isBlocked?'unblock':'block'
const dialoagueref=this.dialoag.open(ConfirmationcomponentComponent,{
      data:{title:'Confirm Action',message:`Are you sure you want to ${action} this student?`}
    })

    dialoagueref.afterClosed().subscribe(result=>{
      if(result){
        console.log('padachone',instructor._id)
      
        this.authservice.toggleblockInstructor(instructor._id).subscribe(
          ()=>{
            this.loadInstructors()
          },
          (error:any)=>{
              console.log('error occured while blocking/unblocking')
          }
        )
      }
    })
   }





   openVerificationModal(instructor: instructors): void {
    const dialogRef = this.dialoag.open(InstructorverificationModalComponent, {
      width: '600px',
      data: instructor
    });

    dialogRef.afterClosed().subscribe(result => {
      // Optionally refresh the list if changes were made
      if (result) {
        this.loadInstructors();
      }
    });
  }



}
