import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserviceService } from '../../../services/authservice.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';

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
   userType:'student'|'instructor'='student'
   showPassword:boolean=false


    constructor(private fb:FormBuilder,private studentService:AuthserviceService,private instructorService:InstructorauthserviceService,private router:Router,private route:ActivatedRoute){
      this.loginForm=this.fb.group({
        email:['',[Validators.required,Validators.email]],
        password:['',[Validators.required]]
      })
    }

    ngOnInit(){
      this.route.data.subscribe(data=>{
        this.userType=data['userType']
        console.log('UserType from route data:', this.userType);
      })
    }

    loginNow(){
      this.errormessage=''
      this.message=''
      if(this.loginForm.valid){
        const logindata=this.userType==='instructor'?{
          emailaddress:this.loginForm.value.email,
          password:this.loginForm.value.password
        }:this.loginForm.value

        const service=this.userType==='instructor'?this.instructorService:this.studentService



        service.login(logindata).subscribe(
          response=>{
            console.log('login successfull')
            this.message=response.message
            setTimeout(()=>{
              const redirectPath=this.userType==='instructor'?'/instructor/home':'/student/home'

              this.router.navigate([redirectPath])
            },1000)
          },
          error=>{
            this.errormessage=error.error.message
          }
        )
      }
      
    }

    getRegisterLink():string{
       return this.userType==='instructor'?'/instructor/register':'/student/register'
    }
    getForgotPasswordLink(){
        return this.userType==='instructor'?'/instructor/forgotpasswordins':'/student/forgotpassword'
    }


    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    }


    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
}
