import { Component } from '@angular/core';
import { FormBuilder, FormsModule, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructor-login',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './instructor-login.component.html',
  styleUrl: './instructor-login.component.scss'
})
export class InstructorLoginComponent {

  instructorLogin:FormGroup

  constructor(private fb:FormBuilder,private readonly instructorservice:InstructorauthserviceService,private router:Router){
    this.instructorLogin=this.fb.group({
      emailaddress:['',[Validators.required]],
      password:['',[Validators.required]]
    })
  }


  // onSubmit(){
  //    return this.instructorservice.login(this.instructorLogin.value).subscribe({
  //    next:( response)=>{
  //       alert('login successfull')
  //       this.router.navigate(['/instructor/home'])
  //     },
  //     error:(error)=>{
  //       alert(error.message)
  //     }
  // })
  // }
  onSubmit(){
     return this.instructorservice.login(this.instructorLogin.value).subscribe(
      response=>{
        alert('login successfull')
        this.router.navigate(['/instructor/home'])
      },
      error=>{
        alert(error.message)
      }
  )
  }
}

