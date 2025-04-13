import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InstructorcourseService } from '../../../../../services/instructorservice/course/instructorcourse.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-course-content',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './course-content.component.html',
  styleUrl: './course-content.component.scss'
})
export class CourseContentComponent implements OnInit{

  @Input() courseData:any;
  @Output() courseDataChange=new EventEmitter<any>()
  @Output() formValid=new EventEmitter<boolean>()
  @Output() submitStep=new EventEmitter<void>()
  @Output() previousStep=new EventEmitter<void>()

  isUploading:{ [key:number]:boolean}={}

  uploadProgress:number[]=[]


  contentForm:FormGroup;

  constructor(private fb:FormBuilder,private courseService:InstructorcourseService){
     this.contentForm=this.fb.group({
         sections:this.fb.array([])
     })

     this.addSection();

     this.contentForm.statusChanges.subscribe(status=>{
      this.formValid.emit(status==='VALID')
     })
  }


  get sections(){
    return this.contentForm.get('sections') as FormArray
  }


  createSection(){
    return this.fb.group({
      title:['',[Validators.required]],
      description:['',[Validators.required]],
      videoUrl:['',[Validators.required]],
      duration:[0,[Validators.required,Validators.min(0)]],
      order:[this.sections.length+1],
      resources:this.fb.array([])

    })
  }


  addSection(){
    this.sections.push(this.createSection())
  }

  removeSection(index:number){
    this.sections.removeAt(index);
    this.sections.controls.forEach((section,idx)=>{
      section.patchValue({order:idx + 1})
    })
  }


  getResources(sectionIndex:number){
    return this.sections.at(sectionIndex).get('resources') as FormArray
  }


  createResource():FormGroup{
    return this.fb.group({
      title:['',[Validators.required]],
      fileUrl:['',[Validators.required]],
      fileType:['',[Validators.required]]
    })
  }


  addResource(sectionIndex:number){
    const resources=this.getResources(sectionIndex);
      resources.push(this.createResource())
  }


  removeResource(sectionIndex:number,resourceIndex:number){
    const resources=this.getResources(sectionIndex);
    resources.removeAt(resourceIndex)
  }


  async onVideoSelected(event:any,sectionIndex:number){
     const file=event.target.files[0]
     if(file){
      this.isUploading[sectionIndex]=true
      this.uploadProgress[sectionIndex]=0

      const interval = setInterval(() => {
        if (this.uploadProgress[sectionIndex] < 95) {
          this.uploadProgress[sectionIndex] += 5;
        }
      }, 200);
        try {
          const response=await this.courseService.uploadVideo(file).toPromise()
          this.uploadProgress[sectionIndex] = 100;
          if(response?.videoUrl){
            this.sections.at(sectionIndex).patchValue({videoUrl:response.videoUrl})
          }
        } catch (error) {
          console.error('Error uploading video:',error)
        }
     }
  }


  async onResourceSelected(event:any,sectionIndex:number,resourceIndex:number){
          const file=event.target.files[0]
          if(file){
            try {
              const response=await this.courseService.uploadResources(file).toPromise()
              if(response?.fileUrl){
                const resources=this.getResources(sectionIndex)
                resources.at(resourceIndex).patchValue({fileUrl:response.fileUrl,fileType:file.type})
              }
            } catch (error :any) {
              console.error('Error uploading resources',error.error?.message )
            }
       }
  }


  onSubmit(){
    if(this.contentForm.valid){
      this.courseData={...this.courseData,...this.contentForm.value}
      this.courseDataChange.emit(this.courseData)
      this.submitStep.emit()
    }
  }

  onPrevious(){
    this.previousStep.emit()
  }

  ngOnInit(){
     if(this.courseData?.section?.length){
      this.patchFormData()
     }
  }

  ngOnChanges(changes:SimpleChanges){
     if(changes['courseData']&&this.courseData?.section?.length){
      this.patchFormData()
     }
  }


  private patchFormData() {
    // Clear existing sections
    while (this.sections.length) {
      this.sections.removeAt(0);
    }

    // Add sections from courseData
    this.courseData.sections.forEach((section: any) => {
      const sectionGroup = this.createSection();
      sectionGroup.patchValue({
        title: section.title,
        description: section.description,
        videoUrl: section.videoUrl,
        duration: section.duration,
        order: section.order
      });


      if (section.resources?.length) {
        const resourcesArray = sectionGroup.get('resources') as FormArray;
        section.resources.forEach((resource: any) => {
          resourcesArray.push(this.fb.group({
            title: resource.title,
            fileUrl: resource.fileUrl,
            fileType: resource.fileType
          }));
        });
      }

      this.sections.push(sectionGroup);
    });
  }

  
}
