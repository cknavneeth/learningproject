import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { passwordMatchValidator } from '../../../validators/password-match.validator';
import { AuthserviceService } from '../../../services/authservice.service';
import { SharedemailService } from '../../../services/shared/sharedemail.service';


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

  constructor(private fb: FormBuilder,private authservice:AuthserviceService,private router:Router,private sharedemail:SharedemailService) {
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
}
