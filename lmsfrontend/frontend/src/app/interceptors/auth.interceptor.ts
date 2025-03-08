import { HttpInterceptorFn } from '@angular/common/http';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authservice=inject(AuthserviceService)
  const accesstoken=authservice['accesstoken']

  let authreq=req
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
        return authservice.refreshToken().pipe(
          switchMap((response)=>{
            const newaccesstoken=response.accesstoken
            authservice['accesstoken']=newaccesstoken

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
