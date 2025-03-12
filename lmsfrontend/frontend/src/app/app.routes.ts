import { Routes } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { OtpverificationComponent } from './components/auth/otpverification/otpverification.component';
import { HomeComponent } from './components/maincomponent/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { InstructorRegisterComponent } from './components/instructorauth/instructor-register/instructor-register.component';
import { InstructorotpComponent } from './components/instructorauth/instructorotp/instructorotp.component';
import { InstructorLoginComponent } from './components/instructorauth/instructor-login/instructor-login.component';
import { HomeinsComponent } from './components/insMaincomponent/homeins/homeins.component';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { AdminlayoutComponent } from './components/layout/adminlayout/adminlayout.component';
import { AdminloginComponent } from './components/admin/adminlogin/adminlogin.component';

export const routes: Routes = [
    {
       path:'',component:LandingpageComponent
    },
    {
        path:'register',component:RegisterComponent
    },
    {
        path:'sentotp',component:OtpverificationComponent
    },
    {
        path:'home',component:LandingpageComponent
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
    },
    {
        path:'instructor/home',component:HomeinsComponent
    },
    {
        path:'admin',component:AdminlayoutComponent,children:[
            {path:'login',component:AdminloginComponent}
        ]
    }
];
