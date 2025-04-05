import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseStateService {
  private courseDataSubject = new BehaviorSubject<any>({
    title: '',
    category: '',
    courseTopic: '',
    price: '',
    courseLanguage: '',
    duration: '',
    courseLevel: '',
    description: '',
    targetAudience: [],
    courseRequirements: [],
    sections: [],
    thumbnailUrl: ''
  });

  courseData$: Observable<any> = this.courseDataSubject.asObservable();

  updateCourseData(newData: any) {
    const currentData = this.courseDataSubject.value;
    
    // Handle array fields by merging instead of replacing
    const updatedData = {
      ...currentData,
      ...newData,
      targetAudience: newData.targetAudience 
        ? [...currentData.targetAudience, ...newData.targetAudience] 
        : currentData.targetAudience,
      courseRequirements: newData.courseRequirements 
        ? [...currentData.courseRequirements, ...newData.courseRequirements] 
        : currentData.courseRequirements,
      sections: newData.sections 
        ? [...currentData.sections, ...newData.sections] 
        : currentData.sections
    };
    
    // Remove any undefined values
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }
    });
    
    this.courseDataSubject.next(updatedData);
  }

  updateField(field: string, value: any) {
    const currentData = this.courseDataSubject.value;
    const updatedData = {
      ...currentData,
      [field]: value
    };
    
    // Remove any undefined values
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }
    });
    
    this.courseDataSubject.next(updatedData);
  }

  getField(field: string): any {
    return this.courseDataSubject.value[field];
  }

  hasField(field: string): boolean {
    return field in this.courseDataSubject.value;
  }

  getCurrentData(): any {
    return this.courseDataSubject.value;
  }

  resetCourseData() {
    this.courseDataSubject.next({
      title: '',
      category: '',
      courseTopic: '',
      price: '',
      courseLanguage: '',
      duration: '',
      courseLevel: '',
      description: '',
      targetAudience: [],
      courseRequirements: [],
      sections: [],
      thumbnailUrl: ''
    });
  }
}