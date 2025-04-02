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
import { StudentprofileComponent } from './components/studentmain/studentprofile/studentprofile.component';
import { InstructorprofileComponent } from './components/insMaincomponent/instructorprofile/instructorprofile.component';
import { CoursecreationComponent } from './components/insMaincomponent/coursecreation/coursecreation.component';
import { CourseBasicInfoComponent } from './components/insMaincomponent/features/course/course-basic-info/course-basic-info.component';
import { CourseDetailsComponent } from './components/insMaincomponent/features/course/course-details/course-details.component';
import { CourseContentComponent } from './components/insMaincomponent/features/course/course-content/course-content.component';
import { CoursePublishComponent } from './components/insMaincomponent/features/course/course-publish/course-publish.component';

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
        component:ResetpasswordComponent,
        data:{userType:'student'}
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
                component: OtpverificationComponent,
                data:{userType:'student'}
            },
            {
                path: 'login',
                component: LoginComponent,
                canActivate:[loginGuard],
                data:{userType:'student'}
            },
            {
                path:'forgotpassword',
                component:ForgorpasswordComponent,
                data:{userType:'student'}
            },
            {
                path:'home',
                component:LandingpageComponent,
                canActivate:[authGuard]
            },
            {
                path:'profile',
                component:StudentprofileComponent,
                canActivate:[authGuard]
            }
           
        ]
    },



    {
        path:'instructorresetpassword/:token',
        component:ResetpasswordComponent,
        data:{userType:'instructor'}
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
                component: OtpverificationComponent,
                data:{userType:'instructor'}
            },
            {
                path: 'instructorlogin',
                component: LoginComponent,
                canActivate:[instructorLogin],
                data:{userType:'instructor'}
            },
            {
                path: 'home', 
                component: HomeinsComponent,
                canActivate:[instructorguardGuard]
            },
            {
                path:'forgotpasswordins',
                component:ForgorpasswordComponent,
                data:{userType:'instructor'}
            },
            {
                path:'profile',
                component:InstructorprofileComponent,
                canActivate:[instructorguardGuard]
            },
            {
                path:'courses',
                canActivate:[instructorguardGuard],
                children:[
                    {
                        path:'',
                        component: CoursecreationComponent,
                        // children: [
                        //     {
                        //         path: '',
                        //         component: CourseBasicInfoComponent
                        //     },
                        //     {
                        //         path: 'details',
                        //         component: CourseDetailsComponent
                        //     },
                        //     {
                        //         path: 'content',
                        //         component: CourseContentComponent
                        //     },
                        //     {
                        //         path: 'publish',
                        //         component: CoursePublishComponent
                        //     }
                        // ]
                    }
                ]
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