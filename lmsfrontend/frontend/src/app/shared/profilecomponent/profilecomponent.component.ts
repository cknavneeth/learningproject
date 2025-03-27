import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profilecomponent',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './profilecomponent.component.html',
  styleUrl: './profilecomponent.component.scss'
})
export class ProfilecomponentComponent {
   
  @Input() userType:'student'|'instructor'='student'
  @Input() userData:any
  @Output() profileUpdate=new EventEmitter<any>()
  @Output() passwordUpdate=new EventEmitter<any>()

  profileForm:FormGroup;
  passwordForm:FormGroup;
  showPassword:boolean=false;
  message:string=''
  errormessage:string=''

  constructor(private fb:FormBuilder){
       this.profileForm=this.fb.group({
        name:['',[Validators.required]],
        email:['',[Validators.required,Validators.email]],
        phone:['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
        bio:['',[Validators.required]]
       })

       this.passwordForm=this.fb.group({
        currentPassword:['',[Validators.required]],
        newPassword:['',[Validators.required,Validators.minLength(6),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]],
        confirmPassword:['',[Validators.required]]
       })

      }

      ngOnInit(){
        if(this.userData){
          this.updateFormWithUserData()
        }
      }
      private updateFormWithUserData() {
        this.profileForm.patchValue({
          name: this.userData.username || '',  
          email: this.userData.email || '',
          phone: this.userData.phone || '',
          bio: this.userData.bio || ''
        });
      }



  onProfileSubmit(){
     if(this.profileForm.valid){
      this.profileUpdate.emit(this.profileForm.value)
     }
  }

  onPasswordSubmit(){
    if(this.passwordForm.valid){
      if(this.passwordForm.value.newPassword!==this.passwordForm.value.confirmPassword){
        this.errormessage='Passwords do not match'
        return;
      }
      this.passwordUpdate.emit({
        currentPassword:this.passwordForm.value.currentPassword,
        newPassword:this.passwordForm.value.newPassword
      })
    }
  }
  

  togglePasswordForm() {
    this.showPassword = !this.showPassword;
  }
  
}
