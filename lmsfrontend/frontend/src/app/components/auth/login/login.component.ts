import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserviceService } from '../../../services/authservice.service';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatButtonModule,FormsModule,CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isDarkMode:boolean=true
   loginForm:FormGroup
   message:string=''
   errormessage:string=''


    constructor(private fb:FormBuilder,private service:AuthserviceService,private router:Router){
      this.loginForm=this.fb.group({
        email:['',[Validators.required,Validators.email]],
        password:['',[Validators.required]]
      })
    }

    loginNow(){
      this.errormessage=''
      this.message=''
      if(this.loginForm.valid){
        this.service.login(this.loginForm.value).subscribe(
          response=>{
            console.log('login successfull')
            this.message=response.message
            setTimeout(()=>{

              this.router.navigate(['/student/home'])
            },1000)
          },
          error=>{
            this.errormessage=error.error.message
          }
        )
      }
      
    }


    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    }
}
