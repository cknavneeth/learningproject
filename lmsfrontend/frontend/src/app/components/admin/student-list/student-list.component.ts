import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { students } from '../../../interfaces/auth.interface';
import { AuthserviceService } from '../../../services/authservice.service';
import { AdminserviceService } from '../../../services/adminservice.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationcomponentComponent } from '../../common/confirmationcomponent/confirmationcomponent.component';
import { TableColumn, TablecomponentComponent } from '../../../shared/tablecomponent/tablecomponent.component';


@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule,MatDialogModule,TablecomponentComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
  schemas: [NO_ERRORS_SCHEMA] 
})
export class StudentListComponent implements OnInit {
  students: students[] = [];


  columns:TableColumn[]=[
    {header:'Name',field:'username',type:'image'},
    {header:'Email',field:'email',type:'text'},
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
      header: 'Block Status',
      field: 'isBlocked',
      type: 'status',
      statusOptions: {
        trueValue: 'Blocked',
        falseValue: 'Active',
        trueClass: 'bg-red-100 text-red-800',
        falseClass: 'bg-green-100 text-green-800'
      }
    },
    {
      header:'Actions',field:'actions',type:'action'
    }
  ]

  constructor(private authservice: AdminserviceService,private dialoag:MatDialog) {}

  ngOnInit() {
    this.fetchallstudents();
  }

  fetchallstudents() {
    this.authservice.fetchstudents().subscribe((data) => {
      console.log('ithan data',data)
      this.students = data;
    });
  }

  handleTableAction(event:{action:string,item:any}){
    if(event.action==='toggleBlock'){
      this.toggleBlock(event.item)
    }
  }

  toggleBlock(student: students) {
    console.log('studentine nokkunne',student)
    const action=student.isBlocked?'unblock':'block'

    const dialoagueref=this.dialoag.open(ConfirmationcomponentComponent,{
      data:{title:'Confirm Action',message:`Are you sure you want to ${action} this student?`}
    })

    dialoagueref.afterClosed().subscribe(result=>{
      if(result){
        console.log('padachone',student._id)
      
        this.authservice.toggleBlockStatus(student._id).subscribe(
          ()=>{
            this.fetchallstudents()
          },
          (error:any)=>{
              console.log('error occured while blocking/unblocking')
          }
        )
      }
    })
    // Implement the block/unblock logic here
    // You'll need to create a new method in your service to handle this
    // this.authservice.toggleBlockStatus(student.id).subscribe(() => {
    //   this.fetchallstudents(); // Refresh the list after updating
    // });
  }
}
