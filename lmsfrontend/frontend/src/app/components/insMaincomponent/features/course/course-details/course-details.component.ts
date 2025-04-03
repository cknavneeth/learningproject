import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InstructorcourseService } from '../../../../../services/instructorservice/course/instructorcourse.service';
import { firstValueFrom } from 'rxjs';

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
export class CourseDetailsComponent implements OnInit{
    @Input() courseData:any;
    @Output() courseDataChange=new EventEmitter<any>()
    @Output() formValid=new EventEmitter<boolean>()
    @Output() submitStep=new EventEmitter<void>()
    @Output() previousStep=new EventEmitter<void>()

    detailsForm:FormGroup;
    thumbnailPreview:string|null=null;

    constructor(private fb:FormBuilder,private courseService:InstructorcourseService){
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


    async onThumbnailSelected(event:any){
      const file=event.target.files[0]
      if (file) {
        try {
            // Show preview
            const reader = new FileReader();
            reader.onload = () => {
                this.thumbnailPreview = reader.result as string;
            };
            reader.readAsDataURL(file);

            // Upload thumbnail
            const response: any = await firstValueFrom(this.courseService.uploadThumbnail(file));
            if (response?.thumbnailUrl) {
                this.courseData = {
                    ...this.courseData,
                    thumbnailUrl: response.thumbnailUrl
                };
                this.courseDataChange.emit(this.courseData);
            }
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
        }


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


    ngOnInit() {
      if (this.courseData) {
        this.patchFormData();
      }
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['courseData'] && this.courseData) {
        this.patchFormData();
      }
    }

    private patchFormData() {
      // Clear existing arrays
      while (this.targetAudience.length) {
        this.targetAudience.removeAt(0);
      }
      while (this.courseRequirements.length) {
        this.courseRequirements.removeAt(0);
      }

      // Patch basic fields
      this.detailsForm.patchValue({
        description: this.courseData.description || ''
      });

      // Add target audience items
      if (this.courseData.targetAudience?.length) {
        this.courseData.targetAudience.forEach((item: string) => {
          this.targetAudience.push(this.fb.control(item));
        });
      } else {
        this.addTargetAudience();
      }
      if (this.courseData.courseRequirements?.length) {
        this.courseData.courseRequirements.forEach((item: string) => {
          this.courseRequirements.push(this.fb.control(item));
        });
      } else {
        this.addCourseRequirement();
      }

      // Set thumbnail preview if exists
      if (this.courseData.thumbnailUrl) {
        this.thumbnailPreview = this.courseData.thumbnailUrl;
      }
    }

}
