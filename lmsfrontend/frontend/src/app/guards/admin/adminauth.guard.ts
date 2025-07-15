import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenserviceService } from '../../services/tokenservice.service';

export const adminauthGuard: CanActivateFn = (route, state) => {
   
  const router=inject(Router)
  const tokenService=inject(TokenserviceService)



  const admintoken=tokenService.getToken()
  const currentUserType=tokenService.getCurrentUserType()

  if(admintoken&& currentUserType==='admin'){
    return true
  }else{
    router.navigate(['/admin/login'])
    return false
  }
};



export const adminLogin:CanActivateFn=(route,state)=>{
    const router=inject(Router)
    const tokenService=inject(TokenserviceService)

    const admintoken=tokenService.getToken()

    const currentUserType=tokenService.getCurrentUserType()

    if(admintoken&&currentUserType==='admin'){
      router.navigate(['/admin/dashboard'])
      return false
    }
    return true
}