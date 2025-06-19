import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AuthserviceService } from '../services/authservice.service';
import { InstructorauthserviceService } from '../services/instructorauthservice.service';
import { TokenserviceService } from '../services/tokenservice.service';
import { RefreshTokenResponse } from '../interfaces/tokenresponse.interface';



export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const studentauthservice = inject(AuthserviceService);
  const instructorauthservice = inject(InstructorauthserviceService);
  const tokenservice = inject(TokenserviceService);
  const router = inject(Router);

  if (req.url.includes('/refreshtoken') || req.url.includes('/auth/admin')) {
    return next(req);
  }

  const userType = tokenservice.getCurrentUserType();
  let accesstoken: string | null = null;
  let authservice: { refreshToken: () => Observable<RefreshTokenResponse> } | null = null;
  let authreq = req;

  if (userType === 'student') {
    accesstoken = tokenservice.getStudentToken();
    authservice = studentauthservice;
  } else if (userType === 'instructor') {
    accesstoken = tokenservice.getInstructorToken();
    authservice = instructorauthservice;
  }

  if (accesstoken) {
    authreq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accesstoken}`
      }
    });
  }

  return next(authreq).pipe(
    catchError(error => {
      if (error.status === 401 && !error.error?.isBlocked && authservice) {
        console.log('Attempting token refresh...');

        return authservice.refreshToken().pipe(
          switchMap((response: RefreshTokenResponse) => {
            console.log('Refresh token response:', response);
            if (!response.accesstoken) {
              if (userType === 'student') {
                tokenservice.removeStudentToken();
                router.navigate(['/student/login']);
              } else if (userType === 'instructor') {
                tokenservice.removeInstructorToken();
                router.navigate(['/instructor/instructorlogin']);
              }
              return throwError(() => new Error('No access token received'));
            }

            const newRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accesstoken}`
              }
            });
            return next(newRequest);
          }),
          catchError(refreshError => {
            console.log('Refresh token failed:', refreshError);
            if (userType === 'student') {
              tokenservice.removeStudentToken();
              router.navigate(['/student/login']);
            } else if (userType === 'instructor') {
              tokenservice.removeInstructorToken();
              router.navigate(['/instructor/instructorlogin']);
            }
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
