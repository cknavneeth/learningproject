import { Routes } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { OtpverificationComponent } from './components/auth/otpverification/otpverification.component';

export const routes: Routes = [
    {
        path:'register',component:RegisterComponent
    },
    {
        path:'sentotp',component:OtpverificationComponent
    }
];
