import { Component } from '@angular/core';
import { InstructorprofileService } from '../../../services/instructorservice/instructorprofile.service';

@Component({
  selector: 'app-instructorprofile',
  imports: [],
  templateUrl: './instructorprofile.component.html',
  styleUrl: './instructorprofile.component.scss'
})
export class InstructorprofileComponent {
 
  instructorData:any
  message:string=''
  errormessage:string=''

  constructor(private instructorprofile:InstructorprofileService){}


  ngOnInit():void{
    this.instructorprofile.getInstructorProfile().subscribe(
      response=>{
        this.instructorData=response
      },
      error=>{
        this.errormessage=error.error.message
      }
    )
  }

  updateProfile(profileData:any){
    this.instructorprofile.updateInstructorProfile(profileData).subscribe(
      response=>{
        console.log('profile updated successfully')
        this.message=response.message
      },
      error=>{
        this.errormessage=error.error.message
        console.log(error.error.message)
      }
    )
  }

  updatePassword(passwordData:any){
    this.instructorprofile.updateInstructorPassword(passwordData).subscribe(
      response=>{
        console.log('password updated successfully')
      },
      error=>{
        this.errormessage=error.error.message
        console.log(error.error.message)
      }
    )
  }
}
