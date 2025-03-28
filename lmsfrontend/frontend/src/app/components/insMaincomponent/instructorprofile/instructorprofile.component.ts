import { Component } from '@angular/core';
import { InstructorprofileService } from '../../../services/instructorservice/instructorprofile.service';
import { ProfilecomponentComponent } from '../../../shared/profilecomponent/profilecomponent.component';
import { CommonModule } from '@angular/common';

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

  constructor(private instructorprofile:InstructorprofileService){}


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
          certificateUrl:response.certificateUrl
        };
        
        console.log('Formatted instructor data:', this.instructorData);
      },
      error: (error) => {
        console.error('Profile fetch error:', error);
        this.errormessage = error.error?.message || 'Failed to load profile';
      }
    });
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
