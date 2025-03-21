import { HttpInterceptorFn } from '@angular/common/http';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { InstructorauthserviceService } from '../services/instructorauthservice.service';
import { TokenserviceService } from '../services/tokenservice.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  console.log('tholik')

  const studentauthservice=inject(AuthserviceService)
  const instructorauthservice=inject(InstructorauthserviceService)
  const tokenservice=inject(TokenserviceService)
  const router=inject(Router)

  if (req.url.includes('/auth/admin')) {
    return next(req);
  }

  let accesstoken:string|null=null

  let authreq=req

  if(req.url.includes('/student')){
      accesstoken=tokenservice.getStudentToken()
  }else if(req.url.includes('/instructor')){
    accesstoken=tokenservice.getInstructorToken()
  }

 
  if(accesstoken){
    authreq=req.clone({
      setHeaders:{
        Authorization:`Bearer ${accesstoken}`
      }
    })
  }
  return next(authreq).pipe(
    tap({
      next: (response) => {
        console.log('Response success:', response);
      },
      error: (error) => {
        console.log('Response error in tap:', error);
      },
      complete: () => {
        console.log('Request complete');
      }
    }),
    
    
    catchError(error=>{
      
      console.log('Error caught in interceptor:', {
        status: error.status,
        error: error.error,
        fullError: error
      });
      if(error.status==401&&error.error?.isBlocked){
        console.log('user got blocked redirecting to login')
         //my code for checking the user is blocked or not
         
          if(req.url.includes('/student')){
            tokenservice.removeStudentToken()
            router.navigate(['/student/login'])
          }else if(req.url.includes('/instructor')){
             tokenservice.removeInstructorToken()
             router.navigate(['/instructor/login'])
          }
           return throwError(()=>error)
      }





      if(error.status==401){
       
        //my code for refreshing token
        const authservice=req.url.includes('/instructor/')?instructorauthservice:studentauthservice
        return authservice.refreshToken().pipe(
          switchMap((response)=>{
            tap((response)=>{
              console.log('response again',response)
            })
            const newaccesstoken=response.accesstoken
            authservice.saveAccesstoken(newaccesstoken)
            if(req.url.includes('/student')){
                  tokenservice.setStudentToken(newaccesstoken)
            }else if(req.url.includes('/instructor')){
                  tokenservice.setInstructorToken(newaccesstoken)
            }

            let retryreq=req.clone({
              setHeaders:{
                Authorization:`Bearer ${newaccesstoken}`
              }
            })

            return next(retryreq)
          }),
          catchError(error=>{
            if(req.url.includes('/student')){
               tokenservice.removeStudentToken()
            }else if(req.url.includes('/instructor')){
               tokenservice.removeInstructorToken()
            }
            console.log('refresh token failed bro')
            return throwError(()=>error)
          })
        )
      }
      return throwError(()=>error)
    })
  )
};
