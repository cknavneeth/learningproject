import { HttpInterceptorFn } from '@angular/common/http';
import { TokenserviceService } from '../services/tokenservice.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const admininterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  

     const tokenService=inject(TokenserviceService)

     const router=inject(Router)

    //  if(!req.url.includes('/auth/admin')){
    //   return next(req)
    //  }
   

     if(req.url.includes('/auth/admin/logout')||req.url.includes('/auth/admin/login')){
      return next(req)
     }

     const adminToken=tokenService.getToken()
     let authReq=req

     if(adminToken){
      authReq=req.clone({
        setHeaders:{
          Authorization:`Bearer ${adminToken}`
        }
      })
     }


     return next(authReq).pipe(
      catchError(error=>{
        if(error.status==401){
          tokenService.removeToken()
          router.navigate(['/admin/login'])
        }
        return throwError(()=>error)
      })
     )
};
