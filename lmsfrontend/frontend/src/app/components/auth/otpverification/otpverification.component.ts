import { Component, Input, OnInit } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedemailService } from '../../../services/shared/sharedemail.service';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';
import { OtpVerificationData } from '../../../interfaces/auth.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-otpverification',
  imports: [CommonModule,FormsModule],
  templateUrl: './otpverification.component.html',
  styleUrl: './otpverification.component.scss'
})
export class OtpverificationComponent implements OnInit{

  userType: 'student' | 'instructor' = 'student';




  isDarkMode:boolean=true
   email:string=''
   otp:string=''
   message:string=''
   errormessages:string=''
   otpsent:boolean=false


   //adding new properties for the timer
   timeLeft:number=300
   timerInterval:any
   showResendButton:boolean=false
   private clockInterval: any;

   constructor(private route:ActivatedRoute,private studentservice:AuthserviceService ,private router:Router,private sharedemail:SharedemailService,private instructorservice:InstructorauthserviceService){}

   ngOnInit(){
    this.route.data.subscribe(data => {
      this.userType = data['userType'];
      console.log('UserType from route data:', this.userType);
    });

    this.email = this.sharedemail.getEmail();
    this.startTimer()
    // localStorage.removeItem("timerEndTime");
    
   }


   ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
  }

  startTimer() {
    const storedEndTime = localStorage.getItem("timerEndTime");
    const currentTime = Date.now();

    // If timer exists, calculate remaining time
    if (storedEndTime) {
        const endTime = parseInt(storedEndTime);
        const remainingTime = Math.floor((endTime - currentTime) / 1000);
        this.timeLeft = Math.max(remainingTime, 0);
    } else {
        // First time starting timer
        this.timeLeft = 300;
        const endTime = currentTime + (this.timeLeft * 1000);
        localStorage.setItem("timerEndTime", endTime.toString());
    }

    // Update show resend button based on time left
    this.showResendButton = this.timeLeft === 0;

    // Clear any existing interval
    if (this.timerInterval) {
        clearInterval(this.timerInterval);
    }

    // Only start interval if there's time remaining
    if (this.timeLeft > 0) {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            
            if (this.timeLeft <= 0) {
                this.showResendButton = true;
                clearInterval(this.timerInterval);
                localStorage.removeItem("timerEndTime");
            }
        }, 1000);
    }
}
  



   formatTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  

  //  sendOtp(){
  //   this.errormessages=''
  //   this.message=''
  //   this.service.sendOtp(this.email).subscribe(
  //     response=>{
  //       console.log('sented successfully')
  //       this.message='OTP sent successfully'
  //       this.otpsent=true
  //     },
  //     error=>{
  //       this.errormessages='Failed sent otp please try again later'
  //     }
  //   )
  //  }

  resendOtp() {
    this.errormessages = '';
    this.message = '';
    
    // Validate email before sending
    if (!this.email) {
        this.errormessages = 'Email not found';
        return;
    }

    if (this.userType === 'student') {
        this.studentservice.sendOtp(this.email).subscribe({
            next: (response) => {
                console.log('OTP resent successfully:', response);
                this.message = 'OTP sent successfully';
                this.otpsent = true;
                
                // Reset timer
                const endTime = Date.now() + (300 * 1000);
                localStorage.setItem("timerEndTime", endTime.toString());
                this.timeLeft = 300;
                this.showResendButton = false;
                this.startTimer();
            },
            error: (error) => {
                console.error('Error resending OTP:', error);
                this.errormessages = error.error?.message || 'Failed to send OTP, please try again';
            }
        });
    } else {
        const emailData = { emailaddress: this.email }; // Make sure to match backend expected format
        
        this.instructorservice.sendOtp(this.email).subscribe({
            next: (response) => {
                console.log('Instructor OTP resent successfully:', response);
                this.message = 'OTP sent successfully';
                this.otpsent = true;
                
                // Reset timer
                const endTime = Date.now() + (300 * 1000);
                localStorage.setItem("timerEndTime", endTime.toString());
                this.timeLeft = 300;
                this.showResendButton = false;
                this.startTimer();
            },
            error: (error) => {
                console.error('Error resending instructor OTP:', error);
                this.errormessages = error.error?.message || 'Failed to send OTP, please try again';
            }
        });
    }
}

   verifyOtp(){
    this.errormessages=''

    const verifyParams = {
      email: this.email,
      otp: this.otp,
        
  };
console.log('verifying otp with params,',verifyParams)

console.log('Attempting OTP verification:', {
  userType: this.userType,
  params: verifyParams
});

if (this.userType === 'student') {
  this.studentservice.verifyotp(verifyParams).subscribe({
    next: (response) => {
      console.log('Student verification response:', response);
      this.handleVerificationSuccess('/student/login');
    },
    error: (error) => {
      console.log('Student verification error:', {
        status: error.status,
        message: error.error?.message,
        error: error
      });
      this.handleVerificationError(error);
    }
  });
} 
else {
  
  const instructorParams = {
    emailaddress: this.email,
    otp: this.otp
};

  console.log('Sending instructor verification request:', instructorParams);

  this.instructorservice.verifyotp(instructorParams).subscribe({
    next: (response) => {
      console.log('Instructor verification response:', response);
      this.handleVerificationSuccess('/instructor/instructorlogin');
    },
    error: (error) => {
      console.log('Instructor verification error:', {
        status: error.status,
        message: error.error?.message,
        error: error
      });
      this.handleVerificationError(error);
    }
  });
}


   }

   private handleVerificationSuccess(redirectPath: string) {
    console.log('OTP verification successful');
    this.message = 'OTP verified successfully';
    setTimeout(() => {
      this.router.navigate([redirectPath]);
    }, 2000);
  }

  private handleVerificationError(error: any) {
    if (error.error?.message) {
      this.errormessages = error.error.message;
    } else if (error.status === 0) {
      this.errormessages = 'Unable to connect to server';
    } else if (error.status === 400) {
      this.errormessages = 'Invalid OTP or request';
    } else {
      this.errormessages = 'Verification failed. Please try again.';
    }
  }




   toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }









  
}
