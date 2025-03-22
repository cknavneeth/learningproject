import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserviceService } from '../../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';

@Component({
  selector: 'app-forgorpassword',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './forgorpassword.component.html',
  styleUrl: './forgorpassword.component.scss'
})
export class ForgorpasswordComponent implements OnInit{
   forgotstudentform:FormGroup
   errormessage:string=''
   message:string=''
   userType:'student'|'instructor'='student'

   

   constructor(private fb:FormBuilder,private authservice:AuthserviceService,private instructorservice:InstructorauthserviceService,private route:ActivatedRoute){
         this.forgotstudentform=this.fb.group({
          email:['',[Validators.required,Validators.email]]
         })
   }

   //ngoninit for taking usertype here
   ngOnInit(): void {
       this.route.data.subscribe(data=>{
        this.userType=data['userType']
       })
    
   }



   onSubmit(){
    //new content
    if(!this.forgotstudentform.valid){
      return;
    }

    this.errormessage='';
    this.message=''

    const email=this.forgotstudentform.value.email;
    if(this.userType=='student'){
      this.handlestudentforgotpassword(email)
    }else{
      this.handleinstructorforgotpassword(email)
    }

    //new content

   
   }




   handlestudentforgotpassword(email:string){
    this.authservice.forgotpassword(email).subscribe(
      response=>{
        this.message=response.message
      },
      error=>{
        this.errormessage=error.error.message||'An Error Occured While Sending Link'
      }
    )
   }


   handleinstructorforgotpassword(email:string){
     this.instructorservice.forgotpasswordInstructor(email).subscribe(
      response=>{
        this.message=response.message
      },
      error=>{
        this.errormessage=error.error.message||'An Error Occured While Sending Link'
      }
     )
   }
}
