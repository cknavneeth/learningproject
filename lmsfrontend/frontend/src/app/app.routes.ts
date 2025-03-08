import { Routes } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { OtpverificationComponent } from './components/auth/otpverification/otpverification.component';
import { HomeComponent } from './components/maincomponent/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { InstructorRegisterComponent } from './components/instructorauth/instructor-register/instructor-register.component';
import { InstructorotpComponent } from './components/instructorauth/instructorotp/instructorotp.component';
import { InstructorLoginComponent } from './components/instructorauth/instructor-login/instructor-login.component';

export const routes: Routes = [
    {
        path:'register',component:RegisterComponent
    },
    {
        path:'sentotp',component:OtpverificationComponent
    },
    {
        path:'home',component:HomeComponent
    },
    {
        path:'login',component:LoginComponent
    },
    {
        path:'instructorregister',component:InstructorRegisterComponent
    },
    {
        path:'instructorotp',component:InstructorotpComponent
    },
    {
        path:'instructorlogin',component:InstructorLoginComponent
    }
];
