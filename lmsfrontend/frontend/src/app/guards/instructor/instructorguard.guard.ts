import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenserviceService } from '../../services/tokenservice.service';

export const instructorguardGuard: CanActivateFn = (route, state) => {
  

  const router=inject(Router)
  const tokenService=inject(TokenserviceService)

  const accesstoken=tokenService.getInstructorToken()
  console.log('iam router guard but there is no token for instructor')
  if(accesstoken){
    return true
  }else{
    router.navigate(['/instructor/login'])
    return false
  }
};


export const instructorLogin:CanActivateFn=(route,state)=>{
  const router=inject(Router)
  const tokenService=inject(TokenserviceService)

  const accesstoken=tokenService.getInstructorToken()

  if(accesstoken){
    router.navigate(['/instructor/home'])
    return false
  }
  return true
}


