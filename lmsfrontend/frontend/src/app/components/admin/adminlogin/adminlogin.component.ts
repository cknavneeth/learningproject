import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminserviceService } from '../../../services/adminservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminlogin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adminlogin.component.html',
  styleUrl: './adminlogin.component.scss'
})
export class AdminloginComponent implements OnInit {
    adminLogin: FormGroup;
    isDarkMode = false;
    showPassword = false;
    isLoading = false;
    errorMessage:string= '';
    message:string=''

    constructor(
        private fb: FormBuilder,
        private adminservice: AdminserviceService,
        private router: Router
    ) {
        this.adminLogin = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
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

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    onLogin() {
        if (this.adminLogin.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            
            this.adminservice.adminloginform(this.adminLogin.value).subscribe({
                next: (response) => {
                    this.message=response.message
                    setTimeout(()=>{

                        this.router.navigate(['/admin/dashboard']);
                    })
                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMessage = 'Invalid credentials. Please try again.';
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
        } else {
            this.adminLogin.markAllAsTouched();
        }
    }

    getErrorMessage(controlName: string): string {
        const control = this.adminLogin.get(controlName);
        if (control?.errors && control.touched) {
            if (control.errors['required']) {
                return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
            }
            if (control.errors['email']) {
                return 'Please enter a valid email address';
            }
            if (control.errors['minlength']) {
                return 'Password must be at least 6 characters long';
            }
        }
        return '';
    }
}
