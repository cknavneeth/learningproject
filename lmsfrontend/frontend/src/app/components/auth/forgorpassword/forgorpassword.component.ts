import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserviceService } from '../../../services/authservice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgorpassword',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './forgorpassword.component.html',
  styleUrl: './forgorpassword.component.scss'
})
export class ForgorpasswordComponent {
   forgotstudentform:FormGroup

   constructor(private fb:FormBuilder,private authservice:AuthserviceService){
         this.forgotstudentform=this.fb.group({
          email:['',[Validators.required,Validators.email]]
         })
   }

   onSubmit(){
    
      return this.authservice.forgotpassword(this.forgotstudentform.value.email).subscribe(
        response=>{
          alert('reset link sented successfully')
        },
        error=>{
          alert('error happened bro iam tired')
        }
      )
   
   }
}
