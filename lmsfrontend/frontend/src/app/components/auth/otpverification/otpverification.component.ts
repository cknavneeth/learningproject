import { Component } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otpverification',
  imports: [CommonModule,FormsModule],
  templateUrl: './otpverification.component.html',
  styleUrl: './otpverification.component.scss'
})
export class OtpverificationComponent {
   email:string=''
   otp:string=''
   message:string=''

   constructor(private service:AuthserviceService){}

   sendOtp(){
    this.service.sendOtp(this.email).subscribe(
      response=>{
        console.log('sented successfully')
        this.message='otp sent successfully'
      },
      error=>{
        this.message='no otp sented'
      }
    )
   }
}
