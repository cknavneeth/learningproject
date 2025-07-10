import { Component, OnInit } from '@angular/core';
import { instructors } from '../../../interfaces/auth.interface';
import { AdminserviceService } from '../../../services/adminservice.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationcomponentComponent } from '../../common/confirmationcomponent/confirmationcomponent.component';
import { InstructorverificationModalComponent } from '../instructorverification-modal/instructorverification-modal.component';
import { TableColumn, TablecomponentComponent } from '../../../shared/tablecomponent/tablecomponent.component';

@Component({
  selector: 'app-instructor-list',
  standalone: true,
  imports: [CommonModule,TablecomponentComponent],
  templateUrl: './instructor-list.component.html',
  styleUrl: './instructor-list.component.scss'
})
export class InstructorListComponent implements OnInit{
   instructors:instructors[]=[]

   constructor(private authservice: AdminserviceService,private dialoag:MatDialog){}

   columns:TableColumn[]=[
       {header:'Name',field:'name',type:'image'},
       {header:'Email',field:'emailaddress',type:'text'},
       {
        header:'Approval Status',
        field:'isApproved',
        type:'status',
        statusOptions:{
          trueValue:'Approved',
          falseValue:'Pending Verification',
          trueClass:'bg-green-100 text-green-800',
          falseClass:'bg-yellow-100 text-yellow-800'
        }
       },
       {
        header:'Verification Status',
        field:'isVerified',
        type:'status',
        statusOptions:{
          trueValue:'Verified',
          falseValue:'Unverified',
          trueClass:'bg-green-100 text-green-800',
          falseClass:'bg-yellow-100 text-yellow-800'
        }
       },
       {
            header:'Block Status',
            field:'isBlocked',
            type:'status',
            statusOptions:{
              trueValue:'Blocked',
              falseValue:'Active',
              trueClass:'bg-red-100 text-red-800',
              falseClass:'bg-green-100 text-green-800'
            }
       },
       {
        header: 'Actions',
        field: 'actions',
        type: 'action'
      }
   ]


   handleTableAction(event:{action:string,item:any}){
    if(event.action==='toggleBlock'){
      this.toggleBlock(event.item)
    }else if(event.action==='verify'){
      this.openVerificationModal(event.item)
    }
   }

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
    console.log('sending instructor into profile for verification',instructor)
    const dialogRef = this.dialoag.open(InstructorverificationModalComponent, {
      width: '600px',
      data: instructor
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInstructors();
      }
    });
  }



}
