import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const snackBar=inject(MatSnackBar)
  const router=inject(Router )


  return next(req).pipe(
    catchError((error)=>{
        console.log('error interceptor error',error)


        switch(error.status){
          case HttpStatusCode.BadRequest:
            snackBar.open(error.error?.message||'Bad Request','Close',{
              duration:3000,
              horizontalPosition:'right',
              verticalPosition:'top',
              panelClass:['error-snackbar']
            })
            break;

          case HttpStatusCode.Unauthorized:
            if(!req.url.includes('/auth')&&!error.error?.isBlocked){
              snackBar.open(error.error?.message||'session expired please login again','Close',{
                duration:3000,
                horizontalPosition:'right',
                verticalPosition:'top',
                panelClass:'error-snackbar'
              })

              if(req.url.includes('/student')){
                router.navigate(['/student/login'])
              }else{
                router.navigate(['/instructor/instructorlogin'])
              }
            }
            break;


            case HttpStatusCode.NotFound:
              snackBar.open(error.error?.message||'Resource not found','Close',{
                duration:3000,
                horizontalPosition:'right',
                verticalPosition:'top',
                panelClass:['error-snackbar']
              })
              break;


              case HttpStatusCode.Conflict:
                snackBar.open(error.error?.message||'conflict occured','Close',{
                  duration:3000,
                  horizontalPosition:'right',
                  verticalPosition:'top',
                  panelClass:['error-snackbar']
                })
                break;

                
              case 0:
                snackBar.open('Unable to connect to server','Close',{
                  duration:3000,
                  horizontalPosition:'right',
                  verticalPosition:'top',
                  panelClass:['error-snackbar']
                })
                break;

              default:
                snackBar.open('Something went wrong','Close',{
                  duration:3000,
                  horizontalPosition:'right',
                  verticalPosition:'top',
                  panelClass:['error-snackbar']
                })
                break;
        }

        return throwError(()=>error)
    })
  )
};
