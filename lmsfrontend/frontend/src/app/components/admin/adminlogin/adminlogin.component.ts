import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminserviceService } from '../../../services/adminservice.service';

@Component({
  selector: 'app-adminlogin',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './adminlogin.component.html',
  styleUrl: './adminlogin.component.scss'
})
export class AdminloginComponent {
    adminLogin:FormGroup

    constructor(private fb:FormBuilder ,private adminservice:AdminserviceService){
       this.adminLogin=this.fb.group({
        email:['',[Validators.required,Validators.email]],
        password:['',[Validators.required]]
       })
    }


    onLogin(){
       return this.adminservice.adminloginform(this.adminLogin.value).subscribe(
        response=>{
          alert('wow login successfull')
        },
        error=>{
          alert('wow error happened')
        }
       )
    }
}
