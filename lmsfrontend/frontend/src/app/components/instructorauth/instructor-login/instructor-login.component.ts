import { Component } from '@angular/core';
import { FormBuilder, FormsModule, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructor-login',
  imports: [ReactiveFormsModule,FormsModule,CommonModule,RouterModule],
  templateUrl: './instructor-login.component.html',
  styleUrl: './instructor-login.component.scss'
})
export class InstructorLoginComponent {

  instructorLogin:FormGroup
  isDarkMode:boolean=true
  message:string=''
  errormessage:string=''

  constructor(private fb:FormBuilder,private readonly instructorservice:InstructorauthserviceService,private router:Router){
    this.instructorLogin=this.fb.group({
      emailaddress:['',[Validators.required]],
      password:['',[Validators.required]]
    })
  }


  onSubmit(){
     return this.instructorservice.login(this.instructorLogin.value).subscribe(
      response=>{
        this.message=response.message
        this.router.navigate(['/instructor/home'])
      },
      error=>{
        this.errormessage=error.error.message
      }
  )
  }


  toggleDarkMode(){
    this.isDarkMode=!this.isDarkMode
  }
}

