import { Component } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otpverification',
  imports: [CommonModule,FormsModule],
  templateUrl: './otpverification.component.html',
  styleUrl: './otpverification.component.scss'
})
export class OtpverificationComponent {
  isDarkMode:boolean=true
   email:string=''
   otp:string=''
   message:string=''
   errormessages:string=''
   otpsent:boolean=false

   constructor(private service:AuthserviceService ,private router:Router){}

   sendOtp(){
    this.errormessages=''
    this.message=''
    this.service.sendOtp(this.email).subscribe(
      response=>{
        console.log('sented successfully')
        this.message='OTP sent successfully'
        this.otpsent=true
      },
      error=>{
        this.errormessages='Failed sent otp please try again later'
      }
    )
   }

   resendOtp(){
    this.errormessages=''
    this.message=''
    this.service.sendOtp(this.email).subscribe(
      response=>{
        console.log('otp resended successfully')
        this.message='OTP sent successfully'
        this.otpsent=true
      },
      error=>{
        this.errormessages='Failed to sent OTP,please try again'
      }
    )
   }

   verifyOtp(){
    this.errormessages=''
    this.service.verifyotp(this.email,this.otp).subscribe(
      response=>{
        console.log('otp verification successfull')
        this.message='OTP verified successfully'

        setTimeout(()=>{

          this.router.navigate(['/student/login'])
        },2000)
      },
      error=>{
        this.errormessages='Invalid OTP.Please enter the correct OTP'
        console.log('error occured now')
      }
    )
   }




   toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }
}
