import { Component, OnInit } from '@angular/core';
import { students } from '../../../interfaces/auth.interface';
import { AuthserviceService } from '../../../services/authservice.service';
import { AdminserviceService } from '../../../services/adminservice.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationcomponentComponent } from '../../common/confirmationcomponent/confirmationcomponent.component';


@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule,MatDialogModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent implements OnInit {
  students: students[] = [];

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
