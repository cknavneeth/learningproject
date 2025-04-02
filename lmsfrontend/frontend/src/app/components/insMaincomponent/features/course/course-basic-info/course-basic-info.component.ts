import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-course-basic-info',
  imports: [
    CommonModule,
  ReactiveFormsModule,
MatFormFieldModule,
MatInputModule,
MatSelectModule,
MatButtonModule

  ],
  templateUrl: './course-basic-info.component.html',
  styleUrl: './course-basic-info.component.scss'
})
export class CourseBasicInfoComponent {
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

}



