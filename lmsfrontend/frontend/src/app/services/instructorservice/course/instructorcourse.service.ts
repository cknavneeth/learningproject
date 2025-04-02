import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorcourseService {

  private apiUrl='http://localhost:5000/auth/instructor/courses'

  constructor(private http:HttpClient) { }

  uploadVideo(file:File):Observable<{videoUrl:string}>{
    const formData=new FormData()
    formData.append('video',file)
    return this.http.post<{videoUrl:string}>(`${this.apiUrl}/upload-video`,formData)
  }

  uploadResources(file:File):Observable<{fileUrl:string}>{
    const formData=new FormData()
    formData.append('resource',file)
    return this.http.post<{fileUrl:string}>(`${this.apiUrl}/upload-resource`,formData)
  }

  uplaodThumbnail(file:File){
     const formData=new FormData()
     formData.append('thumbnail',file)
     return this.http.post(`${this.apiUrl}/upload-thumbnail`,formData)
  }

  createCourse(courseData:any):Observable<any>{
    return this.http.post(`${this.apiUrl}`,courseData)
  }

  updateCourse(courseId:string,courseData:any):Observable<any>{
    return this.http.put(`${this.apiUrl}/${courseId}`,courseData)
  }

  publishCourse(courseId:string):Observable<any>{
     return this.http.put(`${this.apiUrl}/${courseId}/publish`,{})
  }

}
