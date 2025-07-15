import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenserviceService } from '../../services/tokenservice.service';

export const authGuard: CanActivateFn = (route, state) => {
  
    const router=inject(Router)
    const tokenService=inject(TokenserviceService)
    const studentAccessToken=tokenService.getToken()



    const currentUserType=tokenService.getCurrentUserType()

    console.log("Auth Guard - Token Found:", studentAccessToken); 

  if (studentAccessToken&&currentUserType==='student') {
    console.log('accessgranted')
    return true;
  } else {
    console.log("hihhhh")
    router.navigate(['/student/login']);
    return false; 
   
  }
};


export const loginGuard:CanActivateFn=(route,state)=>{
  const router=inject(Router)
  const tokenService=inject(TokenserviceService)
  const studentAccessToken=tokenService.getToken()

  const currentUserType=tokenService.getCurrentUserType()

  if(studentAccessToken&&currentUserType==='student'){
    router.navigate(['/student/home'])
    return false
  }
  return true
}
