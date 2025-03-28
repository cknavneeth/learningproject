import { Component } from '@angular/core';
import { ProfileserviceService } from '../../../services/studentservice/profileservice.service';
import { ProfilecomponentComponent } from '../../../shared/profilecomponent/profilecomponent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-studentprofile',
  imports: [ProfilecomponentComponent,ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './studentprofile.component.html',
  styleUrl: './studentprofile.component.scss'
})
export class StudentprofileComponent {
  studentData:any
  message:string=''
  errormessage:string=''

  constructor(private service:ProfileserviceService){}

  ngOnInit():void{
    this.service.getStudentProfile().subscribe(
      response=>{
        console.log('profile fetched successfuly',response)
        this.studentData = {
          username: response.username,
          email: response.email,
          phone: response.phone || '',
          bio: response.bio || ''
        };
        console.log('student data ahno',this.studentData)
      },
      error=>{
        console.log('profile error fetching',error)
        console.log('profile error fetching',error.error.message)
      }
    )
  }


  updateProfile(profileData:any){
    this.service.updateStudentProfile(profileData).subscribe(
      response=>{
        console.log('profile updated successfully',response)
        this.message
        this.ngOnInit()
      },
      error=>{
        this.errormessage=error.error.message
        console.log(error.error.message)
      }
    )
  }

  updatePassword(passwordData:any){
    this.service.updateStudentPassword(passwordData).subscribe(
      response=>{
        console.log('password updated successfully',response)
        this.message=response.message
        this.ngOnInit()
      },
      error=>{
        this.errormessage=error.error.message
        console.log(error.error.message)
      }
    )
  }


}
