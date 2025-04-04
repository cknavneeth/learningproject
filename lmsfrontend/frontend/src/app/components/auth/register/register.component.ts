import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { passwordMatchValidator } from '../../../validators/password-match.validator';
import { AuthserviceService } from '../../../services/authservice.service';
import { SharedemailService } from '../../../services/shared/sharedemail.service';
import { GoogleauthService } from '../../../services/shared/googleauth.service';
import { TokenserviceService } from '../../../services/tokenservice.service';


declare global {
  interface Window {
      google?: {
          accounts: {
              id: {
                  initialize: (config: any) => void;
                  renderButton: (element: HTMLElement, options: any) => void;
                  prompt: () => void;
              };
          };
      };
  }
}

@Component({
  selector: 'app-register',
  imports: [RouterModule,CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  message: string = '';
  errormessage: string = '';
  isDarkMode: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isSubmitted:boolean=false

  googleClientId='518954628771-9lhni13ubu5h1q56sb7boosucvkudc2g.apps.googleusercontent.com'
  

  constructor(private fb: FormBuilder,private authservice:AuthserviceService,private router:Router,private sharedemail:SharedemailService,private googleAuthService: GoogleauthService,private ngZone: NgZone,private tokenservice: TokenserviceService) {
    this.registerForm = this.fb.group({
      username: ['',[ Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', 
        [  
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ]],
      confirmpassword: ['', Validators.required]
    }, { validator: passwordMatchValidator });
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }

    this.initializeGoogleSignIn();
  }

  toggleDarkMode(): void {
    if (document.documentElement.classList.contains('dark')) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  enableDarkMode(): void {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    this.isDarkMode = true;
  }

  disableDarkMode(): void {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    this.isDarkMode = false;
  }

 

  onSubmit() {
    if (this.registerForm.valid) {
      this.errormessage='';
      this.message=''
      this.isSubmitted=true
      if(this.registerForm.valid){
        this.authservice.register(this.registerForm.value).subscribe(
          response=>{
            this.sharedemail.setEmail(this.registerForm.value.email)
            this.message=response.message
          setTimeout(()=>{
            localStorage.removeItem('timerEndTime')
            this.router.navigate(['student/sentotp'])
          },1000)
        },
        error=>{
            this.errormessage=error.error.message
        }
      )
  
      console.log(this.registerForm.value);
    }
  }
}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }



  //google login
  
  private initializeGoogleSignIn() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: this.googleClientId,
                callback: (response: any) => {
                    this.ngZone.run(() => {
                        this.handleCredentialResponse(response);
                    });
                },
                auto_select: false,
                cancel_on_tap_outside: true
            });
            window.google.accounts.id.renderButton(
                document.getElementById('googleSignInDiv')!,
                {
                    theme: this.isDarkMode ? 'filled_black' : 'outline',
                    size: 'large',
                    type: 'standard',
                    shape: 'rectangular',
                    text: 'signup_with',
                    logo_alignment: 'left'
                }
            );
        }
    };
}


private handleCredentialResponse(response: any) {
  console.log("Google response:", response);
  if (response.credential) {
      this.handleGoogleSignIn(response.credential);
  } else {
      this.errormessage = 'Google sign-in failed: No credential received';
  }
}


private handleGoogleSignIn(credential: string) {
  this.googleAuthService.verifyGoogleToken(credential, 'student').subscribe({
    next: (response: any) => {
      if (response.accesstoken) {
        this.tokenservice.setStudentToken(response.accesstoken);
        this.message = 'Google sign-in successful';
        
        setTimeout(() => {
          this.router.navigate(['/student/home']);
        }, 1000);
      } else {
        this.errormessage = 'Login failed: No access token received';
      }
    },
    error: (error) => {
      console.error('Google signin error', error);
      this.errormessage = error.error?.message || 'Google sign-in failed';
    }
  });
}
}
