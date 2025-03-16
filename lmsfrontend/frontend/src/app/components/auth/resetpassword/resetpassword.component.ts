import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../../../services/authservice.service';

@Component({
  selector: 'app-resetpassword',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss'
})
export class ResetpasswordComponent {
   resetpasswordform:FormGroup
   message:string=''
   errormessage:string=''
   token:string=''
   showPassword: boolean = false;

   constructor(private fb:FormBuilder,private route:ActivatedRoute,private readonly authservice:AuthserviceService,private router:Router){
    this.resetpasswordform=this.fb.group({
      password:['',[Validators.required,Validators.minLength(6)]]
    })

   }

   ngOnInit(){
    this.route.params.subscribe(params=>{
      this.token=params['token'];
      if(!this.token){
        this.message="invalid reset link"
        this.router.navigate(['/student/login'])
      }
    })
   }

   onSubmit(){
       return this.authservice.resetpassword(this.token,this.resetpasswordform.value.password).subscribe(
        response=>{
          this.message=response.message
          setTimeout(()=>{
            this.router.navigate(['/student/login'])
          },2000)
        },
        error=>{
          this.errormessage=error.error.message
        }
       )
   }



   togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
