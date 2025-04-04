import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon'; 
@Component({
  selector: 'app-course-basic-info',
  imports: [
    CommonModule,
  ReactiveFormsModule,
MatFormFieldModule,
MatInputModule,
MatSelectModule,
MatButtonModule,
MatIconModule 

  ],
  templateUrl: './course-basic-info.component.html',
  styleUrl: './course-basic-info.component.scss'
})
export class CourseBasicInfoComponent implements OnInit,OnChanges{
    @Input() courseData:any;
    @Output() courseDataChange=new EventEmitter<boolean>()
    @Output() formValid=new EventEmitter<boolean>()
    @Output() submitStep=new EventEmitter<void>()

    categories=['Programming','Design','Business','Marketing','Health','Fitness']

    languages=['English','spanish','french','chinese']

    levels=['Beginner','Intermediate','Advanced']

    basicInfoForm:FormGroup

    constructor(private fb:FormBuilder){
      this.basicInfoForm=this.fb.group({
        title:['',[Validators.required,Validators.minLength(5)]],
        category:['',Validators.required],
        courseTopic:['',Validators.required],
        price:['',[Validators.required,Validators.min(0)]],
        courseLanguage:['',Validators.required],
        duration:['',[Validators.required,Validators.min(0)]],
        courseLevel:['',Validators.required]
      })

      this.basicInfoForm.statusChanges.subscribe(status=>{
        this.formValid.emit(status==='VALID')
      })
    }

    onSubmit(){
      if(this.basicInfoForm.valid){
        this.courseData={...this.courseData,...this.basicInfoForm.value}
        this.courseDataChange.emit(this.courseData)
        this.submitStep.emit()
      }
    }



    ngOnInit() {
      // Patch form with existing data if available
      if (this.courseData) {
        this.basicInfoForm.patchValue({
          title: this.courseData.title || '',
          category: this.courseData.category || '',
          courseTopic: this.courseData.courseTopic || '',
          price: this.courseData.price || '',
          courseLanguage: this.courseData.courseLanguage || '',
          duration: this.courseData.duration || '',
          courseLevel: this.courseData.courseLevel || ''
        });
      }
    }


    ngOnChanges(changes: SimpleChanges) {
      if (changes['courseData'] && this.courseData) {
        this.basicInfoForm.patchValue({
          title: this.courseData.title || '',
          category: this.courseData.category || '',
          courseTopic: this.courseData.courseTopic || '',
          price: this.courseData.price || '',
          courseLanguage: this.courseData.courseLanguage || '',
          duration: this.courseData.duration || '',
          courseLevel: this.courseData.courseLevel || ''
        });
      }
    }


    clearField(fieldName: string) {
      this.basicInfoForm.get(fieldName)?.setValue('');
    }
    
}



