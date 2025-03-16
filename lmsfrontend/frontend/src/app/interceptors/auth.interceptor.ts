import { HttpInterceptorFn } from '@angular/common/http';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { InstructorauthserviceService } from '../services/instructorauthservice.service';
import { TokenserviceService } from '../services/tokenservice.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const studentauthservice=inject(AuthserviceService)
  const instructorauthservice=inject(InstructorauthserviceService)
  const tokenservice=inject(TokenserviceService)

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
    catchError(error=>{
      if(error.status==401){

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
