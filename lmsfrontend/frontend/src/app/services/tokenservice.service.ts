import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenserviceService {

  private Student_token_key='studentaccesstoken'
  private instructor_token_key='instructoraccesstoken'
  private ADMIN_TOKEN_KEY='adminToken'

  constructor() {}


  public setStudentToken(token:string){
    localStorage.setItem(this.Student_token_key,token)
  }

  public getStudentToken():string|null{
    return localStorage.getItem(this.Student_token_key)
  }

  public removeStudentToken():void{
    console.log('REMOVING STUDENT TOKEN - Stack trace:', new Error().stack);
    localStorage.removeItem(this.Student_token_key)
  } 

  public setInstructorToken(token:string){
    localStorage.setItem(this.instructor_token_key,token)
  }

  public getInstructorToken():string|null{
    return localStorage.getItem(this.instructor_token_key)
  }

  public removeInstructorToken(){
    console.log('why removing instructor token here',new Error().stack)
    localStorage.removeItem(this.instructor_token_key)
  }


  //for admin sections ok 

  public removeAdminToken(): void {
    
    localStorage.removeItem(this.ADMIN_TOKEN_KEY);
    localStorage.removeItem('admintoken'); 
    localStorage.removeItem('adminToken'); 
  }

  public getAdminToken(): string | null {
    return localStorage.getItem(this.ADMIN_TOKEN_KEY) || 
           localStorage.getItem('admintoken') || 
           localStorage.getItem('adminToken');
  }

  public setAdminToken(token: string): void {
    this.removeAdminToken();
    localStorage.setItem(this.ADMIN_TOKEN_KEY, token);
  }


   public getCurrentUserType(): 'student' | 'instructor' | 'admin' | null {
    if (this.getStudentToken()) return 'student';
    if (this.getInstructorToken()) return 'instructor';
    if (this.getAdminToken()) return 'admin';
    return null;
  }
}
