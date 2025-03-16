import { Routes } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { OtpverificationComponent } from './components/auth/otpverification/otpverification.component';
import { LoginComponent } from './components/auth/login/login.component';
import { InstructorRegisterComponent } from './components/instructorauth/instructor-register/instructor-register.component';
import { InstructorotpComponent } from './components/instructorauth/instructorotp/instructorotp.component';
import { InstructorLoginComponent } from './components/instructorauth/instructor-login/instructor-login.component';
import { HomeinsComponent } from './components/insMaincomponent/homeins/homeins.component';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { AdminlayoutComponent } from './components/layout/adminlayout/adminlayout.component';
import { AdminloginComponent } from './components/admin/adminlogin/adminlogin.component';
import { StudentcomponentComponent } from './components/layout/studentcomponent/studentcomponent.component';
import { InstructorcomponentComponent } from './components/layout/instructorcomponent/instructorcomponent.component';
import { ForgorpasswordComponent } from './components/auth/forgorpassword/forgorpassword.component';
import { ResetpasswordComponent } from './components/auth/resetpassword/resetpassword.component';
import { InstructorresetpasswordComponent } from './components/instructorauth/instructorresetpassword/instructorresetpassword.component';
import { InstructorforgotpasswordComponent } from './components/instructorauth/instructorforgotpassword/instructorforgotpassword.component';
import { AdmindashboardComponent } from './components/admin/admindashboard/admindashboard.component';
import { StudentListComponent } from './components/admin/student-list/student-list.component';
import { InstructorListComponent } from './components/admin/instructor-list/instructor-list.component';
import { authGuard, loginGuard } from './guards/student/auth.guard';
import { instructorguardGuard, instructorLogin } from './guards/instructor/instructorguard.guard';
import { adminauthGuard, adminLogin } from './guards/admin/adminauth.guard';

export const routes: Routes = [
    {
        path: '',
        component: StudentcomponentComponent,
        children: [
            {
                path: '',
                component: LandingpageComponent
            }
        ]
    },

    {
        path:'resetpassword/:token',
        component:ResetpasswordComponent
    },
    {
        path: 'student',
        component: StudentcomponentComponent,
        children: [
            {
                path: '',
                component: LandingpageComponent
            },
            {
                path: 'register',
                component: RegisterComponent,
                canActivate:[loginGuard]
            },
            {
                path: 'sentotp',
                component: OtpverificationComponent
            },
            {
                path: 'login',
                component: LoginComponent,
                canActivate:[loginGuard]
            },
            {
                path:'forgotpassword',
                component:ForgorpasswordComponent
            },
            {
                path:'home',
                component:LandingpageComponent,
                canActivate:[authGuard]
            }
           
        ]
    },



    {
        path:'instructorresetpassword/:token',
        component:InstructorresetpasswordComponent
    },
    {
        path: 'instructor',
        component: InstructorcomponentComponent,
        children: [
            {
                path: '',
                component: HomeinsComponent
            },
            {
                path: 'register',
                component: InstructorRegisterComponent,
                canActivate:[instructorLogin]
            },
            {
                path: 'instructorotp',
                component: InstructorotpComponent
            },
            {
                path: 'instructorlogin',
                component: InstructorLoginComponent,
                canActivate:[instructorLogin]
            },
            {
                path: 'home', 
                component: HomeinsComponent,
                canActivate:[instructorguardGuard]
            },
            {
                path:'forgotpasswordins',
                component:InstructorforgotpasswordComponent
            }
        ]
    },
    {
        path: 'admin',
        component: AdminlayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: AdminloginComponent,
                canActivate:[adminLogin]
            },
            {
                path:'dashboard',
                component:AdmindashboardComponent,
                canActivate:[adminauthGuard]
            },
            {
                path:'students',
                component:StudentListComponent
            },
            {
                path:'instructors',
                component:InstructorListComponent
            }
        ]
    }
];