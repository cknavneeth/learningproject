import { Component } from '@angular/core';
import { InstructorprofileService } from '../../../services/instructorservice/instructorprofile.service';
import { ProfilecomponentComponent } from '../../../shared/profilecomponent/profilecomponent.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-instructorprofile',
  imports: [ProfilecomponentComponent,CommonModule],
  templateUrl: './instructorprofile.component.html',
  styleUrl: './instructorprofile.component.scss'
})
export class InstructorprofileComponent {
 
  instructorData:any
  message:string=''
  errormessage:string=''
  certificateUrl:string=''

  constructor(private instructorprofile:InstructorprofileService,private snackBar:MatSnackBar){}


  ngOnInit(): void {
    this.loadInstructorProfile();
  }

  loadInstructorProfile(): void {
    this.instructorprofile.getInstructorProfile().subscribe({
      next: (response) => {
        console.log('Raw API response:', response);
        this.certificateUrl=response.certificateUrl
        
        this.instructorData = {
          username: response.name || '',
          email: response.emailaddress || '',
          phone: response.phone || '',
          bio: response.bio || '',
          certificateUrl:response.certificateUrl,
          isApproved:response.isApproved,
          isVerified:response.isVerified,
          rejectionFeedback:response.rejectionFeedback,
          canReapply:response.canReapply,
          rejectedAt:response.rejectedAt
        };
        
        console.log('Formatted instructor data:', this.instructorData);
      },
      error: (error) => {
        this.snackBar.open('Failed To Load Profile','Close',{
          duration:3000,
          horizontalPosition:'right',
          verticalPosition:'top'
        })
        console.error('Profile fetch error:', error);
        this.errormessage = error.error?.message || 'Failed to load profile';
      }
    });
  }

  updateProfile(profileData:any){
    this.instructorprofile.updateInstructorProfile(profileData).subscribe(
      response=>{
        this.snackBar.open('Profile Updated Successfully','Close',{
          duration:3000,
          horizontalPosition:'right',
          verticalPosition:'top'
        })
        this.message=response.message
        this.loadInstructorProfile()
      },
      error=>{
        this.snackBar.open('Failed To Upload Profile','Close',{
          duration:3000,
          horizontalPosition:'right',
          verticalPosition:'top'
        })
        this.errormessage=error.error.message
        console.log(error.error.message)
      }
    )
  }

  updatePassword(passwordData:any){
    this.instructorprofile.updateInstructorPassword(passwordData).subscribe(
      response=>{
        this.snackBar.open('Password Updated successfully','Close',{
          duration:3000,
          horizontalPosition:'right',
          verticalPosition:'top'
        })
        this.message=response.message
      },
      error=>{
        this.snackBar.open('Failed To Update Password','Close',{
          duration:3000,
          horizontalPosition:'right',
          verticalPosition:'top'
        })
        this.errormessage=error.error.message
        console.log(error.error.message)
      }
    )
  }


  //updating the instructor request
  handleReapplyRequest(){
    this.instructorprofile.reapplyAsInstructor().subscribe(
      response=>{
        this.snackBar.open('Reapply request sent successfully','Close',{
          duration:3000,
          horizontalPosition:'right',
          verticalPosition:'top'
        })
        console.log('reapply request sent successfully')
        this.message=response.message
        this.loadInstructorProfile()
      },
      error=>{
        this.errormessage=error.error.message
        console.log(error.error.message)
      }
    )
  }
}
