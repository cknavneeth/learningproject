import { Routes } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { OtpverificationComponent } from './components/auth/otpverification/otpverification.component';
import { HomeComponent } from './components/maincomponent/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';

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
    }
];
