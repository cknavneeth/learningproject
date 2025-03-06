import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserviceService } from '../../../services/authservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
   loginForm:FormGroup
    constructor(private fb:FormBuilder,private service:AuthserviceService,private router:Router){
      this.loginForm=this.fb.group({
        email:['',[Validators.required,Validators.email]],
        password:['',[Validators.required]]
      })
    }

    loginNow(){
      if(this.loginForm.valid){
        this.service.login(this.loginForm.value).subscribe(
          response=>{
            console.log('login successfull')
            this.router.navigate(['/home'])
          },
          error=>{
            console.log('there is error in login')
          }
        )
      }
      
    }
}
