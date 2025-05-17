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
import { CourseDraftComponent } from './components/insMaincomponent/features/course/course-draft/course-draft.component';
import { CourseListComponent } from './components/admin/course-list/course-list.component';
import { StudentcourseComponent } from './components/studentmain/studentcourse/studentcourse.component';
import { CourseDetailComponent } from './components/studentmain/course-detail/course-detail.component';
import { CartComponent } from './components/studentmain/cart/cart.component';
import { WishlistComponent } from './components/studentmain/wishlist/wishlist.component';
import { CategoryManagementComponent } from './components/admin/category-management/category-management.component';
import { AddcouponComponent } from './components/admin/addcoupon/addcoupon.component';
import { ListcouponComponent } from './components/admin/listcoupon/listcoupon.component';
import { CheckoutComponent } from './components/studentmain/checkout/checkout.component';
import { MyCoursesComponent } from './components/insMaincomponent/my-courses/my-courses.component';
import { MyLearningComponent } from './components/studentmain/my-learning/my-learning.component';
import { CoursePlayerComponent } from './components/studentmain/course-player/course-player.component';
import { InstructorstudentsComponent } from './components/insMaincomponent/instructorstudents/instructorstudents.component';
import { SaleshistoryComponent } from './components/admin/saleshistory/saleshistory.component';
import { CertificatesComponent } from './components/studentmain/certificates/certificates.component';
import { InstructorDashboardComponent } from './components/insMaincomponent/instructor-dashboard/instructor-dashboard.component';
import { AdminquizComponent } from './components/admin/adminquiz/adminquiz.component';
import { StudentquizComponent } from './components/studentmain/studentquiz/studentquiz.component';
import { InstructorcommunityComponent } from './components/insMaincomponent/instructorcommunity/instructorcommunity.component';
import { StudentcommunityComponent } from './components/studentmain/studentcommunity/studentcommunity.component';
import { CoursedetailComponent } from './components/insMaincomponent/coursedetail/coursedetail.component';
import {MyaboutComponent} from './components/studentmain/myabout/myabout.component';


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
            },
            {
                path:'courses',
                children:[
                    {
                        path:'',
                        component:StudentcourseComponent,
                        canActivate:[authGuard]
                    },
                    {
                        path:':id',
                        component:CourseDetailComponent,
                        canActivate:[authGuard]
                    }
                ]
            },
            {
                path:'cart',
                component:CartComponent,
                canActivate:[authGuard]
            },
            {
                path:'wishlist',
                component:WishlistComponent,
                canActivate:[authGuard]
            },
            {
                path:'checkout',
                component:CheckoutComponent,
            },
            
            {
                path:'learning',
                component:MyLearningComponent,
                canActivate:[authGuard]
            },
            {
                path: 'course-player/:id',  // Add this new route
                component: CoursePlayerComponent,
                // canActivate: [authGuard]
            },
            {
                path:'certificates',
                component:CertificatesComponent,
                canActivate:[authGuard]
            },
            {
                path:'quiz',
                component:StudentquizComponent,
                canActivate:[authGuard]
            },
            {
                path:'community',
                component:StudentcommunityComponent
            },
            {
                path:'about',
                component:MyaboutComponent
                
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
                       
                    }
                ]
            },
            {
                path:'drafts',
                component:CourseDraftComponent
            },
            {
                path:'my-courses',
                component:MyCoursesComponent
            },
            {
                path:'enrolled-students',
                component:InstructorstudentsComponent
            },
            {
                path:'dashboard',
                component:InstructorDashboardComponent
            },
            {
                path:'community',
                component:InstructorcommunityComponent
            },
            {
                path:'course/:id',
                component:CoursedetailComponent
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
            },
            {
                path:'courses',
                component:CourseListComponent
            },
            {
                path:'category',
                component:CategoryManagementComponent
            },
            {
                path:'coupons/add',
                component:AddcouponComponent
            },
            {
                path:'coupons',
                component:ListcouponComponent
            },
            {
                path:'sales-history',
                component:SaleshistoryComponent
            },
            {
                path:'quiz-management',
                component:AdminquizComponent
            }
           
        ]
    }
];