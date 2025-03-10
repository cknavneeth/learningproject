import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenserviceService {

  private Student_token_key='studentaccesstoken'
  private instructor_token_key='instructoraccesstoken'

  constructor() { }


  public setStudentToken(token:string){
    sessionStorage.setItem(this.Student_token_key,token)
  }

  public getStudentToken():string|null{
    return sessionStorage.getItem(this.Student_token_key)
  }

  public removeStudentToken():void{
    sessionStorage.removeItem(this.Student_token_key)
  } 

  public setInstructorToken(token:string){
    sessionStorage.setItem(this.instructor_token_key,token)
  }

  public getInstructorToken():string|null{
    return sessionStorage.getItem(this.instructor_token_key)
  }

  public removeInstructorToken(){
    sessionStorage.removeItem(this.instructor_token_key)
  }


}
