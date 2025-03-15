import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';

@Component({
  selector: 'app-instructorresetpassword',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './instructorresetpassword.component.html',
  styleUrl: './instructorresetpassword.component.scss'
})
export class InstructorresetpasswordComponent {
   
  insresetpassword:FormGroup
  errormessage:string=''
  message:string=''
  token:string=''

  constructor(private fb:FormBuilder,private route:ActivatedRoute,private authservice:InstructorauthserviceService,private router:Router){
    this.insresetpassword=this.fb.group({
      password:['',[Validators.required,Validators.minLength(6)]]
    })
  }

  ngOnInit(){
      this.route.params.subscribe(params=>{
        this.token=params['token']
        if(!this.token){
          this.errormessage='Invalid Reset Link'
          this.router.navigate(['/instructor/login'])
        }
      })
  }

  onSubmit(){
    this.errormessage=''
    this.message=''
    return this.authservice.resetpasswordinstructor(this.token,this.insresetpassword.value.password).subscribe(
          response=>{
            this.message=response.message
            setTimeout(()=>{
              this.router.navigate(['/instructor/instructorlogin'])
          },2000)
          },
          error=>{
            this.errormessage='Password Reset Got failed'
          }
    )
  }
}
