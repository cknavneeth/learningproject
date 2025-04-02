import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {MatStepperModule} from '@angular/material/stepper';
import { CourseBasicInfoComponent } from '../features/course/course-basic-info/course-basic-info.component';
import { CourseDetailsComponent } from '../features/course/course-details/course-details.component';
import { CourseContentComponent } from '../features/course/course-content/course-content.component';
import { CoursePublishComponent } from '../features/course/course-publish/course-publish.component';
import { InstructorcourseService } from '../../../services/instructorservice/course/instructorcourse.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-coursecreation',
  standalone:true,
  imports: [CommonModule,
    MatStepperModule,
    CourseBasicInfoComponent,
    CourseDetailsComponent,
    CourseContentComponent,
    CoursePublishComponent
  ],
  templateUrl: './coursecreation.component.html',
  styleUrl: './coursecreation.component.scss'
})
export class CoursecreationComponent {
  // @ViewChild('courseBasicInfoComponent')
  //  courseBasicInfoComponent!: CourseBasicInfoComponent;


      courseData:any={}
      basicInfoComplete=false
      detailsComplete=false
      contentComplete=false
      basicInfoForm: FormGroup = new FormGroup({});

      constructor(
        private courseService: InstructorcourseService,
        private router: Router,
        private snackBar: MatSnackBar
      ) {}

      // ngAfterViewInit() {
      //   if (this.courseBasicInfoComponent) {
      //     this.basicInfoForm = this.courseBasicInfoComponent.basicInfoForm;
      //   }
      // }

      onBasicInfoValidityChange(isValid: boolean) {
        this.basicInfoComplete = isValid;
      }

      onDetailsValidityChange(isValid: boolean) {
        this.detailsComplete = isValid;
      }

      onContentValidityChange(isValid: boolean) {
        this.contentComplete = isValid;
      }

      async onPublishCourse(){
        console.log('publishing course',this.courseData)
        try {
          if(!this.courseData._id){
             const createdCourse=await this.courseService.createCourse(this.courseData).toPromise()
             this.courseData._id=createdCourse._id
          }else{
            await this.courseService.updateCourse(this.courseData._id,this.courseData).toPromise()
          }


          await this.courseService.publishCourse(this.courseData._id).toPromise()

          this.snackBar.open('Course published successfully!','Close',{
            duration:3000,
            horizontalPosition:'right',
            verticalPosition:'top'
          })

          this.router.navigate(['/instructor/dashboard'])

        } catch (error) {
           console.error('Error publishing course',error)
           this.snackBar.open('Failed to publish course','Close',{
            duration:3000,
            horizontalPosition:'right',
            verticalPosition:'top'
           })
        }
      }

}
