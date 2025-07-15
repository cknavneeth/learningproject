import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenserviceService {

  private TOKEN_KEY='accessToken'

  constructor() {}


  public setToken(token:string){
    localStorage.setItem(this.TOKEN_KEY,token)
  }

  public getToken():string|null{
    return localStorage.getItem(this.TOKEN_KEY)
  }

  public removeToken():void{
    console.log('REMOVING STUDENT TOKEN - Stack trace:', new Error().stack);
    localStorage.removeItem(this.TOKEN_KEY)
  } 

  


  //for admin sections ok 

 


   public getCurrentUserType(): 'student' | 'instructor' | 'admin' | null {

    try {

    const token=this.getToken()
     if(!token)return null

     const payloadBase64=token.split('.')[1]
     const decodedJson=atob(payloadBase64)
     const decoded=JSON.parse(decodedJson)

     return decoded.role||null
      
    } catch (error) {
      return null
    }
     
   }




}
