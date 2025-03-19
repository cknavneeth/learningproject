import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../../validators/password-match.validator';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SharedemailService } from '../../../services/shared/sharedemail.service';

@Component({
  selector: 'app-instructor-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './instructor-register.component.html',
  styleUrl: './instructor-register.component.scss',
  standalone: true
})
export class InstructorRegisterComponent {

  isDarkMode: boolean = false;
  instructorRegistration: FormGroup;
  fileError: boolean = false;
  selectedFile: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  passwordStrength: number = 0;

  constructor(
    private fb: FormBuilder,
    private service: InstructorauthserviceService,
    private router: Router,
    private sharedemail:SharedemailService
  ) {
    this.instructorRegistration = this.fb.group({
      instructorname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      emailaddress: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmpassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: passwordMatchValidator
    });

   
  }

  

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      const maxSize = 10 * 1024 * 1024; 

      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Please upload only PDF, PNG, or JPG files';
        this.selectedFile = null;
        return;
      }

      if (file.size > maxSize) {
        this.errorMessage = 'File size must be less than 10MB';
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
      this.fileError = false;
      this.errorMessage = '';
    }
  }

  insRegistration() {
    if (this.instructorRegistration.invalid) {
      return;
    }

    if (!this.selectedFile) {
      this.fileError = true;
      return;
    }

    const formData = new FormData();
    formData.append('name', this.instructorRegistration.value.instructorname);
    formData.append('emailaddress', this.instructorRegistration.value.emailaddress);
    formData.append('password', this.instructorRegistration.value.password);
    formData.append('certificate', this.selectedFile);

    this.service.registerinstructor(formData).subscribe({
      next: (response) => {
        this.sharedemail.setEmail(this.instructorRegistration.value.emailaddress)
        this.successMessage = 'Registration successful!';
        setTimeout(() => {
          this.router.navigate(['/instructor/instructorotp']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred during registration';
      }
    });
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

  toggleDarkMode(): void {
    if (this.isDarkMode) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

}
