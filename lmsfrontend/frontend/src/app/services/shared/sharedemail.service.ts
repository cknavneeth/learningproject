import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedemailService {

  private email:string=''

  constructor() {}

  setEmail(email:string){
    this.email=email
    sessionStorage.setItem('verificationEmail',email)
  }

  getEmail():string{
    if(!this.email){
      this.email=sessionStorage.getItem('verificationEmail')||''
    }
    return this.email

  }
}
