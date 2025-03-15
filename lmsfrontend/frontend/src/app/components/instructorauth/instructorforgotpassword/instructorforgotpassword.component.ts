import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';

@Component({
  selector: 'app-instructorforgotpassword',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './instructorforgotpassword.component.html',
  styleUrl: './instructorforgotpassword.component.scss'
})
export class InstructorforgotpasswordComponent {
   instructorforgotpassword:FormGroup
   errormessages:string=''
   message:string=''

   constructor(private fb:FormBuilder,private authservice:InstructorauthserviceService){
       this.instructorforgotpassword=this.fb.group({
        emailaddress:['',[Validators.required,Validators.email]]
       })
   }


   onSubmit(){
    this.errormessages=''
    this.message=''
    return this.authservice.forgotpasswordInstructor(this.instructorforgotpassword.value.emailaddress).subscribe(
      response=>{
        this.message=response.message
        
      },
      error=>{
        this.errormessages=" While sending Reset Link,Error occured"
      }
    )
   }
}
