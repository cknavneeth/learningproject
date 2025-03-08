import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../../validators/password-match.validator';
import { AuthserviceService } from '../../../services/authservice.service';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructor-register',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './instructor-register.component.html',
  styleUrl: './instructor-register.component.scss'
})
export class InstructorRegisterComponent {
  instructorRegistration:FormGroup

  selectedFile:File | null=null

  constructor(private fb:FormBuilder,private service:InstructorauthserviceService,private router:Router){
      this.instructorRegistration=this.fb.group({
          instructorname:['',[Validators.required]],
          emailaddress:['',[Validators.required,Validators.email]],
          password:['',[Validators.required,Validators.minLength(6)]],
          confirmpassword:['',Validators.required]
      },
      {
        validators:passwordMatchValidator
      }
    )
  }

  onFileSelect(event:any){
      const file=event.target.files[0]
      this.selectedFile=file
  }

   insRegistration(){
    if(!this.selectedFile){
      alert('please upload your certificate')
      return
    }
     const formData=new FormData()
     formData.append('name',this.instructorRegistration.value.instructorname)
     formData.append('emailaddress',this.instructorRegistration.value.emailaddress)
     formData.append('password',this.instructorRegistration.value.password)
     formData.append('certificate',this.selectedFile)

     this.service.registerinstructor(formData).subscribe(
      response=>{
        alert('registration successfull')
        this.router.navigate(['/instructorotp'])
      },
      error=>{
        alert('error occured')
        console.log('error occured while registering the instructor')
      }
     )
   }

}
