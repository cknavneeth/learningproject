import { HttpClient, HttpParams } from '@angular/common/http';
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

  uploadThumbnail(file:File){
     const formData=new FormData()
     formData.append('thumbnail',file)
     return this.http.post(`${this.apiUrl}/upload-thumbnail`,formData)
  }

  createCourse(courseData:any,isDraft:boolean):Observable<any>{
    return this.http.post(`${this.apiUrl}`,{...courseData,isDraft})
  }

  updateCourse(courseId:string,courseData:any):Observable<any>{
    console.log('updating course',courseData)
    return this.http.put(`${this.apiUrl}/${courseId}`,courseData)
  }

  publishCourse(courseId:string):Observable<any>{
     return this.http.put(`${this.apiUrl}/${courseId}/publish`,{})
  }

  getCourseById(courseId:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/${courseId}`)
  }

  //related to drafts
  getDrafts():Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/drafts`)
  }

  deleteDraft(draftId:string):Observable<any>{
    return this.http.delete(`${this.apiUrl}/draft/${draftId}`)
  }

  getCourses(page:number=1,limit:number=10):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`,{params:new HttpParams().set('page',page.toString()).set('limit',limit.toString())})
  }


  getEnrolledStudents(page:number=1,limit:number=10):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/enrolled-students`,{params:{page:page.toString(),limit:limit.toString()}})
     
  }


  getCourseDetailsForInstructor(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/details/${courseId}`);
  }
}
