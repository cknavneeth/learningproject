import { Component, OnInit,NgZone } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserviceService } from '../../../services/authservice.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';
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
      handleCredentialResponse?: (response: any) => void;
  }
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatButtonModule,FormsModule,CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent  implements OnInit{
  isDarkMode:boolean=true
   loginForm:FormGroup
   message:string=''
   errormessage:string=''
   userType:'student'|'instructor'='student'
   showPassword:boolean=false


   googleClientId='518954628771-9lhni13ubu5h1q56sb7boosucvkudc2g.apps.googleusercontent.com'


    constructor(private fb:FormBuilder,private studentService:AuthserviceService,private instructorService:InstructorauthserviceService,private router:Router,private route:ActivatedRoute,private googleAuthService:GoogleauthService,private ngZone: NgZone,private tokenservice:TokenserviceService){
      this.loginForm=this.fb.group({
        email:['',[Validators.required,Validators.email]],
        password:['',[Validators.required]]
      })
    }

    ngOnInit(){
        //for google signup
        this.initializeGoogleSignIn();


      this.route.data.subscribe(data=>{
        this.userType=data['userType']
        console.log('UserType from route data:', this.userType);
      })

    
    }







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
                    text: 'signin_with',
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

    //for google signup
    private handleGoogleSignIn(credential: string) {
      this.googleAuthService.verifyGoogleToken(credential, this.userType).subscribe({
          next: (response: any) => {
              if (response.accesstoken) {
                   if(this.userType==='instructor'){
                    this.tokenservice.setInstructorToken(response.accesstoken)
                   }else{
                    this.tokenservice.setStudentToken(response.accesstoken)
                   }
                  
                  this.message = 'Google sign-in successful';
                  
                  setTimeout(() => {
                      const redirectPath = this.userType === 'instructor' ? '/instructor/home' : '/student/home';
                      this.router.navigate([redirectPath]);
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





    //good code


    loginNow(){
      this.errormessage=''
      this.message=''
      if(this.loginForm.valid){
        const logindata=this.userType==='instructor'?{
          emailaddress:this.loginForm.value.email,
          password:this.loginForm.value.password
        }:this.loginForm.value

        const service=this.userType==='instructor'?this.instructorService:this.studentService



        service.login(logindata).subscribe(
          response=>{
            console.log('login successfull')
            this.message=response.message
            setTimeout(()=>{
              const redirectPath=this.userType==='instructor'?'/instructor/home':'/student/home'

              this.router.navigate([redirectPath])
            },1000)
          },
          error=>{
            this.errormessage=error.error.message
          }
        )
      }
      
    }

    getRegisterLink():string{
       return this.userType==='instructor'?'/instructor/register':'/student/register'
    }
    getForgotPasswordLink(){
        return this.userType==='instructor'?'/instructor/forgotpasswordins':'/student/forgotpassword'
    }


    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    }


    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
}


