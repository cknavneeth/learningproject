import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenserviceService } from '../../services/tokenservice.service';

export const authGuard: CanActivateFn = (route, state) => {
  
    const router=inject(Router)
    const tokenService=inject(TokenserviceService)
    const studentAccessToken=tokenService.getStudentToken()

    console.log("Auth Guard - Token Found:", studentAccessToken); // 🔍 Debug Log

  if (studentAccessToken) {
    console.log('accessgranted')
    return true;
  } else {
    router.navigate(['/student/login']);
    return false; 
   
  }
};


export const loginGuard:CanActivateFn=(route,state)=>{
  const router=inject(Router)
  const tokenService=inject(TokenserviceService)
  const studentAccessToken=tokenService.getStudentToken()

  if(studentAccessToken){
    router.navigate(['/student/home'])
    return false
  }
  return true
}
