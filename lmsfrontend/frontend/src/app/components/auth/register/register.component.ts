import { Component } from '@angular/core';
import {FormGroup,FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms'
import { passwordMatchValidator } from '../../../validators/password-match.validator';
import { AuthserviceService } from '../../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
   registerForm:FormGroup;
   isDarkMode:boolean=true

   constructor(private fb:FormBuilder,private authservice:AuthserviceService,private router:Router){
    this.registerForm=this.fb.group(
      {
      username:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]],
      confirmpassword:['',[Validators.required]]
    },
    {
      validators:passwordMatchValidator
    })
   }


   toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

   onSubmit(){
    if(this.registerForm.valid){
      this.authservice.register(this.registerForm.value).subscribe(
        response=>{
        alert('registration successfull')
        this.router.navigate(['student/sentotp'])
      },
      error=>{
        alert('registration failed')
      }
    )
    }
   }
}
