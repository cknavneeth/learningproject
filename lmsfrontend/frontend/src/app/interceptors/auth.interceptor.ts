import { HttpInterceptorFn } from '@angular/common/http';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { InstructorauthserviceService } from '../services/instructorauthservice.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const studentauthservice=inject(AuthserviceService)
  const instructorauthservice=inject(InstructorauthserviceService)

  let accesstoken:string|null=null

  let authreq=req

  if(req.url.includes('/student')){
      accesstoken=studentauthservice['accesstoken']
  }else if(req.url.includes('/instructor')){
    accesstoken=instructorauthservice['accesstoken']
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
            const newaccesstoken=response.accesstoken
            authservice.saveAccesstoken(newaccesstoken)

            let retryreq=req.clone({
              setHeaders:{
                Authorization:`Bearer ${newaccesstoken}`
              }
            })

            return next(retryreq)
          }),
          catchError(error=>{
            console.log('refresh token failed bro')
            return throwError(()=>error)
          })
        )
      }
      return throwError(()=>error)
    })
  )
};
