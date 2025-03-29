import { HttpInterceptorFn } from '@angular/common/http';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { InstructorauthserviceService } from '../services/instructorauthservice.service';
import { TokenserviceService } from '../services/tokenservice.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const studentauthservice = inject(AuthserviceService)
  const instructorauthservice = inject(InstructorauthserviceService)
  const tokenservice = inject(TokenserviceService)
  const router = inject(Router)

  
  if (req.url.includes('/refreshtoken') || req.url.includes('/auth/admin')) {
    return next(req);
  }

  let accesstoken: string | null = null
  let authreq = req

  if (req.url.includes('/student')) {
    accesstoken = tokenservice.getStudentToken()
   

  } else if (req.url.includes('/instructor')) {
    accesstoken = tokenservice.getInstructorToken()
    

  }

  if (accesstoken) {
    authreq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accesstoken}`
      }
    })
  }

  return next(authreq).pipe(
    catchError(error => {
      if (error.status === 401 && !error.error?.isBlocked) {
        console.log('Attempting token refresh...');
        const authservice = req.url.includes('/instructor/') ? instructorauthservice : studentauthservice
        
        return authservice.refreshToken().pipe(
          switchMap(response => {
            console.log('Refresh token response:', response);
            if (!response.accesstoken) {
              // If no new access token, logout
              if (req.url.includes('/student')) {
                tokenservice.removeStudentToken()
                router.navigate(['/student/login'])
              } else {
                tokenservice.removeInstructorToken()
                router.navigate(['/instructor/instructorlogin'])
              }
              return throwError(() => new Error('No access token received'))
            }

            // Clone the original request with new token
            const newRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accesstoken}`
              }
            })
            return next(newRequest)
          }),
          catchError(refreshError => {
            console.log('Refresh token failed:', refreshError)
            if (req.url.includes('/student')) {
              tokenservice.removeStudentToken()
              router.navigate(['/student/login'])
            } else {
              console.log('Removing instructor token and redirecting to login');
              tokenservice.removeInstructorToken()
              router.navigate(['/instructor/instructorlogin'])
            }
            return throwError(() => refreshError)
          })
        )
      }
      return throwError(() => error)
    })
  )
}