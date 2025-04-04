import { Component } from '@angular/core';
import { ProfileserviceService } from '../../../services/studentservice/profileservice.service';
import { ProfilecomponentComponent } from '../../../shared/profilecomponent/profilecomponent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private service:ProfileserviceService,private snackBar:MatSnackBar){}

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
        this.snackBar.open('Profile fetching failed.Try later','Close',{
          duration:3000,
          horizontalPosition:'right',
          verticalPosition:'top'
        })
      }
    )
  }


  updateProfile(profileData:any){
    this.service.updateStudentProfile(profileData).subscribe(
      response=>{
        this.snackBar.open('Profile Updated Successfully!!','Close',{
          duration:3000,
          horizontalPosition:'right',
          verticalPosition:'top'
        })
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
        this.snackBar.open('Password Updated Successfully!!','Close',{
          duration:3000,
          horizontalPosition:'right',
          verticalPosition:'top'
        })
        this.message=response.message
        this.ngOnInit()
      },
      error=>{
        this.snackBar.open('Failed to Update password','Close',{
          duration:3000,
          horizontalPosition:'right',
          verticalPosition:'top'
        })
        this.errormessage=error.error.message
        console.log(error.error.message)
      }
    )
  }


}
