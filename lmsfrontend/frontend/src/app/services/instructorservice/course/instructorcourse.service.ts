import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BackendFullResponse, Course, CourseCreateRequest, CourseDetails, CourseDetailsResponse, DraftCourse, EnrolledStudentsResponse, PaginatedResponse } from '../../../interfaces/course.interface';

@Injectable({
  providedIn: 'root'
})
export class InstructorcourseService {

  // private apiUrl='http://localhost:5000/auth/instructor/courses'
  private apiUrl=`${environment.apiUrl}/auth/instructor/courses`

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

  createCourse(courseData:CourseCreateRequest,isDraft:boolean):Observable<Course>{
    return this.http.post<Course>(`${this.apiUrl}`,{...courseData,isDraft})
  }

  updateCourse(courseId:string,courseData:Partial<CourseCreateRequest>):Observable<Course>{
    console.log('updating course',courseData)
    return this.http.put<Course>(`${this.apiUrl}/${courseId}`,courseData)
  }

  publishCourse(courseId:string):Observable<{message:string}>{
     return this.http.put<{message:string}>(`${this.apiUrl}/${courseId}/publish`,{})
  }

  getCourseById(courseId:string):Observable<CourseDetails>{
    return this.http.get<CourseDetails>(`${this.apiUrl}/${courseId}`)
  }


  getDrafts():Observable<DraftCourse[]>{
    return this.http.get<DraftCourse[]>(`${this.apiUrl}/drafts`)
  }

  deleteDraft(draftId:string):Observable<{message:string}>{
    return this.http.delete<{message:string}>(`${this.apiUrl}/draft/${draftId}`)
  }

  getCourses(page:number=1,limit:number=10,searchTerm:string=''):Observable<PaginatedResponse<Course>>{
    return this.http.get<PaginatedResponse<Course>>(`${this.apiUrl}`,{params:new HttpParams().set('page',page.toString()).set('limit',limit.toString()).set('searchTerm',searchTerm??'')})
  }


  getEnrolledStudents(page:number=1,limit:number=10,searchTerm:string=''):Observable<BackendFullResponse>{
    return this.http.get<BackendFullResponse>(`${this.apiUrl}/enrolled-students`,{params:{page:page.toString(),limit:limit.toString(),searchTerm}})
     
  }


  getCourseDetailsForInstructor(courseId: string): Observable<CourseDetailsResponse> {
    return this.http.get<CourseDetailsResponse>(`${this.apiUrl}/details/${courseId}`);
  }
}
