import { Component } from '@angular/core';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructorotp',
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './instructorotp.component.html',
  styleUrl: './instructorotp.component.scss'
})
export class InstructorotpComponent {
   emailaddress:string=''
   otp:string=''
   message:string=''
   errormessage:string=''
   isDarkMode:boolean=true
   otpSent:boolean=false

   constructor(private instructorservice:InstructorauthserviceService,private router:Router){}

   sendOtp(){
      return this.instructorservice.sendOtp(this.emailaddress).subscribe(
        response=>{
          console.log('otp sended successfully')
          this.otpSent=true
          this.message=response.message
        },
        error=>{
          this.errormessage=error.error.message
          console.log('error sending in otp',error.message)
        }
      )
   }

   resendOtp(){
    console.log('email address for otp',this.emailaddress)
    return this.instructorservice.sendOtp(this.emailaddress).subscribe(
      response=>{
        console.log('otp sended successfully again')
        this.otpSent=true
        this.message=response.message
      },
      error=>{
        console.log('error occured while resending otp')
      }
    )
   }


   verifyOtp(){
      return this.instructorservice.verifyOtp(this.emailaddress,this.otp).subscribe(
        response=>{
          if(response )
          this.message='Otp verified successfully'
        this.router.navigate(['/instructor/instructorlogin'])
        },
        error=>{
          this.errormessage=error.error.message
          console.log('invalid otp')
          console.log(error.message)
        }
      )
   }

   toggleDarkMode(){
    this.isDarkMode=!this.isDarkMode
   }
}
