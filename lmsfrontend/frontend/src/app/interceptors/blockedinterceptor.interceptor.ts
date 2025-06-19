import { HttpInterceptorFn } from '@angular/common/http';
import { TokenserviceService } from '../services/tokenservice.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { InstructorauthserviceService } from '../services/instructorauthservice.service';
import { catchError, throwError } from 'rxjs';
import { HttpStatusCode } from '../shared/enums/status-code.enums';

export const blockedinterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenservice=inject(TokenserviceService)
  const router=inject(Router)
  const studentauthservice=inject(AuthserviceService)
  const instructorauthservice=inject(InstructorauthserviceService)

   if (req.url.includes('/auth/student/refreshtoken') || req.url.includes('/auth/instructor/refreshtoken')) {
    return next(req);
  }


  if(req.url.includes('/auth/admin')){
    return next(req)
  }

  return next(req).pipe(
    catchError(error=>{
      console.log('blocked user interceptor error',error)

        const userType = tokenservice.getCurrentUserType(); 
        console.log('Current user type:', userType)
        if(error.error?.message==='Your account has been blocked'){
        console.log('user blocked detected')

        
        console.log('usertype usertype usertype',userType)
        console.log('req.url at that time',req.url)

        if(req.url.includes('/student/')){
          console.log('handling blocked student')
          
          
          tokenservice.removeStudentToken()
          router.navigate(['/student/login'])
        }

       else if(req.url.includes('/instructor/')){
      
        console.log('handling blocked instructor')
        tokenservice.removeInstructorToken()
        // instructorauthservice.logoutinstructor().subscribe()
        router.navigate(['/instructor/instructorlogin'])
      }
    }
    return throwError(()=>error)
    })

    
  )
};
