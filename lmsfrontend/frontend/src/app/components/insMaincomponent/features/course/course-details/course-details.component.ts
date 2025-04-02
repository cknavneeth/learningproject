import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-course-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule

  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss'
})
export class CourseDetailsComponent {
    @Input() courseData:any;
    @Output() courseDataChange=new EventEmitter<any>()
    @Output() formValid=new EventEmitter<boolean>()
    @Output() submitStep=new EventEmitter<void>()
    @Output() previousStep=new EventEmitter<void>()

    detailsForm:FormGroup;
    thumbnailPreview:string|null=null;

    constructor(private fb:FormBuilder){
         this.detailsForm=this.fb.group({
          description:['',[Validators.required,Validators.required]],
          targetAudience:this.fb.array([]),
          courseRequirements:this.fb.array([])
         })

         this.addTargetAudience()
         this.addCourseRequirement()

         this.detailsForm.statusChanges.subscribe(status=>{
          this.formValid.emit(status==='VALID')
         })
    }


    get targetAudience(){
      return this.detailsForm.get('targetAudience') as FormArray
    }

    get courseRequirements(){
      return this.detailsForm.get('courseRequirements') as FormArray
    }

    addTargetAudience(){
      this.targetAudience.push(this.fb.control('',Validators.required))

    }

    removeTargetAudience(index:number){
       this.targetAudience.removeAt(index)
    }

    addCourseRequirement() {
      this.courseRequirements.push(this.fb.control('', Validators.required));
    }
  
    removeCourseRequirement(index: number) {
      this.courseRequirements.removeAt(index);
    }


    onThumbnailSelected(event:any){
      const file=event.target.files[0]
      if(file){
        const reader=new FileReader()
        reader.onload=()=>{
          this.thumbnailPreview=reader.result as string
        }
        reader.readAsDataURL(file)
      }
    }


    onSubmit(){
      if(this.detailsForm.valid){
        this.courseData={...this.courseData,...this.detailsForm.value}
        this.courseDataChange.emit(this.courseData)
        this.submitStep.emit()
      }
    }


    onPrevious(){
      this.previousStep.emit()
    }


}
