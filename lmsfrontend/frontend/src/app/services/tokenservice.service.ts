import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenserviceService {

  private Student_token_key='studentaccesstoken'
  private instructor_token_key='instructoraccesstoken'
  private ADMIN_TOKEN_KEY='adminToken'

  constructor() { }


  public setStudentToken(token:string){
    localStorage.setItem(this.Student_token_key,token)
  }

  public getStudentToken():string|null{
    return localStorage.getItem(this.Student_token_key)
  }

  public removeStudentToken():void{
    localStorage.removeItem(this.Student_token_key)
  } 

  public setInstructorToken(token:string){
    localStorage.setItem(this.instructor_token_key,token)
  }

  public getInstructorToken():string|null{
    return localStorage.getItem(this.instructor_token_key)
  }

  public removeInstructorToken(){
    localStorage.removeItem(this.instructor_token_key)
  }


  //for admin sections ok 

  public removeAdminToken(): void {
    // Remove only admin-related tokens
    localStorage.removeItem(this.ADMIN_TOKEN_KEY);
    localStorage.removeItem('admintoken'); // Remove lowercase version
    localStorage.removeItem('adminToken'); // Remove mixed case version
  }

  public getAdminToken(): string | null {
    // Check for all possible variants
    return localStorage.getItem(this.ADMIN_TOKEN_KEY) || 
           localStorage.getItem('admintoken') || 
           localStorage.getItem('adminToken');
  }

  public setAdminToken(token: string): void {
    // Remove any existing admin tokens first
    this.removeAdminToken();
    // Set with standardized key
    localStorage.setItem(this.ADMIN_TOKEN_KEY, token);
  }
}
