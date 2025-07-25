import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatStepperModule} from '@angular/material/stepper';
import { CourseBasicInfoComponent } from '../features/course/course-basic-info/course-basic-info.component';
import { CourseDetailsComponent } from '../features/course/course-details/course-details.component';
import { CourseContentComponent } from '../features/course/course-content/course-content.component';
import { CoursePublishComponent } from '../features/course/course-publish/course-publish.component';
import { InstructorcourseService } from '../../../services/instructorservice/course/instructorcourse.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { InstructorprofileService } from '../../../services/instructorservice/instructorprofile.service';

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
 

  courseData:any={}
  basicInfoComplete=false
  detailsComplete=false
  contentComplete=false
  basicInfoForm: FormGroup = new FormGroup({});

  isEditMode=false


  isInstructorApproved:boolean=false

  constructor(
    private profileService:InstructorprofileService,
    private courseService: InstructorcourseService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route:ActivatedRoute
  ) {

    this.checkInstructorStatus()


    this.route.queryParams.subscribe(params=>{
      if(params['id']){
        this.loadCourse(params['id'])
        this.isEditMode=true
      }
    })
  }

  // ngAfterViewInit() {
  //   if (this.courseBasicInfoComponent) {
  //     this.basicInfoForm = this.courseBasicInfoComponent.basicInfoForm;
  //   }
  // }


  async checkInstructorStatus(){
    try {
      const instructorSir=await firstValueFrom(this.profileService.getInstructorProfile())
      if(instructorSir.isApproved==true){
        this.isInstructorApproved=true
      }else{
        this.isInstructorApproved=false
      }
    } catch (error) {
      
    }
  }
 

  async loadCourse(courseId:string){
    try{
        const course=await firstValueFrom(this.courseService.getCourseById(courseId))
        if(course){
          this.courseData={...course}

          //setting completion flags for existing data
          this.basicInfoComplete=this.isBasicInfoComplete()
          this.detailsComplete=this.isDetailsComplete()
          this.contentComplete=this.isContentComplete()

          console.log('Loaded course data:', this.courseData);
        }else{
          throw new Error('Course not found')
        }
        
    }catch(error){
        console.error('eroor loading course',error )
        this.snackBar.open('Failed to load course','Close',{
          duration:3000,
          horizontalPosition:'right',
          verticalPosition:'top'
        })
    }
  }


  private isBasicInfoComplete():boolean{
    return !!(this.courseData.title&&this.courseData.category&&
      this.courseData.price&&this.courseData.courseLanguage&&
      this.courseData.duration&&this.courseData.courseLevel
    )
  }

  private isDetailsComplete():boolean{
    return !!(this.courseData.description&&this.courseData.targetAudience?.length&&
      this.courseData.courseRequirements?.length
    )
  }

  private isContentComplete():boolean{
    return !!(this.courseData.sections?.length)
  }



  async saveDraft(){
    try {
      if(!this.courseData._id){
        const createdCourse=await firstValueFrom(this.courseService.createCourse(this.courseData,true))
        this.courseData._id=createdCourse._id
      }else{
        // await firstValueFrom(this.courseService.updateCourse(this.courseData._id,this.courseData))
        const updatedCourse=await firstValueFrom(this.courseService.updateCourse(this.courseData._id,{
          ...this.courseData,
          status:'draft'
        }))
        console.log('Updated course response:', updatedCourse);
      }

      this.snackBar.open('Draft saved successfully!','Close',{
        duration:3000,
        horizontalPosition:'right',
        verticalPosition:'top'
      })

      this.router.navigate(['/instructor/dashboard'])
    } catch (error) {
       console.error('error saving draft:',error)
       this.snackBar.open('Failed to save draft','Close',{
        duration:3000,
        horizontalPosition:'right',
        verticalPosition:'top'
       })
    }
  }

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
         const createdCourse=await this.courseService.createCourse(this.courseData,false).toPromise()
         this.courseData._id=createdCourse?._id
      }else{
        await this.courseService.updateCourse(this.courseData._id,this.courseData).toPromise()
      }


      await firstValueFrom(this.courseService.publishCourse(this.courseData._id))

      this.snackBar.open('Course published successfully!','Close',{
        duration:3000,
        horizontalPosition:'right',
        verticalPosition:'top'
      })

      this.router.navigate(['/instructor/home'])

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
