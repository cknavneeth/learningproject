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
   otpsent:boolean=false

   constructor(private service:AuthserviceService ,private router:Router){}

   sendOtp(){
    this.service.sendOtp(this.email).subscribe(
      response=>{
        console.log('sented successfully')
        this.message='otp sented successfully'
        this.otpsent=true
      },
      error=>{
        this.message='no otp sented'
      }
    )
   }

   resendOtp(){
    this.service.sendOtp(this.email).subscribe(
      response=>{
        console.log('otp resended successfully')
        this.message='otp sented again successfully'
        this.otpsent=true
      },
      error=>{
        this.message='no otp sended'
      }
    )
   }

   verifyOtp(){
    this.service.verifyotp(this.email,this.otp).subscribe(
      response=>{
        console.log('otp verification successfull')
        this.router.navigate(['/login'])
      },
      error=>{
        this.message='invalid otp'
        console.log('error occured now')
      }
    )
   }




   toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }
}
