import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../../../services/authservice.service';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';
import { passwordMatchValidator } from '../../../validators/password-match.validator';

@Component({
  selector: 'app-resetpassword',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss'
})
export class ResetpasswordComponent {
   resetpasswordform:FormGroup
   message:string=''
   errormessage:string=''
   token:string=''
   showPassword: boolean = false;
   showConfirmPassword:boolean=false
   userType:'student'|'instructor'='student'

   constructor(private fb:FormBuilder,private route:ActivatedRoute,private readonly authservice:AuthserviceService,private router:Router,private instructorservice:InstructorauthserviceService){
    this.resetpasswordform=this.fb.group({
      password:['',[Validators.required,Validators.minLength(6),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/)]],
      confirmpassword:['',[Validators.required]]
    },{
      validator:passwordMatchValidator
    })

   }

   ngOnInit(){

      this.route.data.subscribe(data=>{
        this.userType=data['userType']
      })


    this.route.params.subscribe(params=>{
      this.token=params['token'];
      if(!this.token){
        this.message="invalid reset link"
        // this.router.navigate(['/student/login'])
        this.navigateToLogin()
      }
    })
   }

   onSubmit(){
    if(!this.resetpasswordform.valid){
      return
    }

    const password=this.resetpasswordform.value.password

    if(this.userType==='student'){
      this.handleStudentReset(password)
    }else{
      this.handleInstructorReset(password)
    }
    
   }



   private handleStudentReset(password:string){
    this.authservice.resetpassword(this.token,password).subscribe(
      response=>{
        this.message=response.message
        setTimeout(()=>{
          this.navigateToLogin()
        },2000)
      },
      error=>{
        this.errormessage=error.error.message
      }
    )
   }

   private handleInstructorReset(password:string){
    this.instructorservice.resetpasswordinstructor(this.token,password).subscribe(
      response=>{
        this.message=response.message
        setTimeout(()=>{
          this.navigateToLogin()
        })
      }
    )
   }

   private navigateToLogin(){
    const route=this.userType==='student'?'/student/login':'instructor/instructorlogin'
    this.router.navigate([route])
   }

  //  onSubmit(){
  //      return this.authservice.resetpassword(this.token,this.resetpasswordform.value.password).subscribe(
  //       response=>{
  //         this.message=response.message
  //         setTimeout(()=>{
  //           this.router.navigate(['/student/login'])
  //         },2000)
  //       },
  //       error=>{
  //         this.errormessage=error.error.message
  //       }
  //      )
  //  }



   togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get passwordErrors() {
    const passwordControl = this.resetpasswordform.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    if (passwordControl?.hasError('pattern')) {
      return 'Password must include an uppercase letter, a lowercase letter, a number, and a special character';
    }
    return '';
  }




  get confirmPasswordErrors() {
    const confirmPasswordControl = this.resetpasswordform.get('confirmpassword');
    if (confirmPasswordControl?.hasError('required')) {
      return 'Confirm password is required';
    }
    if (this.resetpasswordform.hasError('passwordMismatch')) {  // Check form-level error
      return 'Passwords do not match';
    }
    return '';
}


   toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
   }
}
