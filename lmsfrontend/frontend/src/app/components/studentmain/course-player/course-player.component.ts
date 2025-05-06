import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { StudentcourseService } from '../../../services/studentservice/course/studentcourse.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudentcertificateService } from '../../../services/studentservice/certificate/studentcertificate.service';

@Component({
  selector: 'app-course-player',
  standalone:true,
  imports: [CommonModule,MatIconModule,MatProgressSpinnerModule],
  templateUrl: './course-player.component.html',
  styleUrl: './course-player.component.scss'
})
export class CoursePlayerComponent {

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;


   courseId:string=''
   courseData:any=null
   currentSection:number=0
   loading=false
   error=''
   completedSections:string[]=[]

   previousOverallProgress:number=0

   constructor(
    private route:ActivatedRoute,
    private studentCourseService:StudentcourseService,
    private snackBar:MatSnackBar,
    private router:Router,
    private certificateService:StudentcertificateService
   ){ }

   ngOnInit():void{
    this.courseId=this.route.snapshot.paramMap.get('id') || ''
    this.loadCourseData()
    this.loadCourseProgress()
   }

   loadCourseData():void{
    this.loading=true
    this.studentCourseService.getEnrolledCourseDetails(this.courseId).subscribe(
      response=>{
        this.courseData=response
        this.currentSection=response.lastAccessedSection || 0
        this.loading=false
        console.log('course data loaded',this.courseData)
      },
      error=>{
        if (error.error?.message === 'You are not enrolled in this course') {
          this.snackBar.open('Please enroll in this course first', 'Close', {duration: 3000});
          this.router.navigate(['/student/courses', this.courseId]);
        } else if (error.status === 401) {
          this.snackBar.open('Please login to continue', 'Close', {duration: 3000});
          this.router.navigate(['/student/login']);
        } else {
          this.error = 'Failed to load course data';
          this.snackBar.open(this.error, 'Close', {duration: 3000});
        }
      }
    )
   }


   isLocked(sectionIndex:number):boolean{
    return sectionIndex>this.currentSection&&!this.isSectionCompleted(sectionIndex)
   }

   onVideoComplete():void{
    if (!this.completedSections.includes(this.currentSection.toString())) {
      this.completedSections.push(this.currentSection.toString());
    }
    this.currentSection++
    this.updateProgress()
   }

   @HostListener('window:beforeunload')
   saveProgressOnExit() {
     this.updateProgress();
   }

   updateProgress():void{
    if (!this.courseData || !this.courseData.sections) {
      this.snackBar.open('Course data not loaded properly', 'Close', {duration: 3000});
      return;
    }

      const sectionId=this.currentSection.toString()


      const totalSections=this.courseData.sections.length
      
      const progressPercentage=(this.completedSections.length/totalSections)*100

      const currentTime=this.videoPlayer?.nativeElement?.currentTime || 0

    this.studentCourseService.updateCourseProgress(
      this.courseId,
      {
        sectionId:sectionId,
        progress:100,
        timestamp:currentTime
      }
    ).subscribe({
      next:response=>{
        this.snackBar.open('Progress updated successfully','Close',{duration:3000})
        // this.loadCourseData()
        if(response.overallProgress===100&&this.previousOverallProgress!==100){
          console.log('gonna generate certificate for me')
          this.generateCertificate()
        }
        this.previousOverallProgress=response.overallProgress
      },
      error:error=>{
        this.snackBar.open('Failed to update progress','Close',{duration:3000})
      }
    })

   }


   downloadResource(resource: any): void {
    this.studentCourseService.downloadResource(this.courseId, resource._id).subscribe({
        next: (response) => {
            // Create a temporary anchor element
            const link = document.createElement('a');
            link.href = response.fileUrl;
            link.download = response.fileName || 'download'; // Use fileName from response or default
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.snackBar.open('Download started', 'Close', {duration: 3000});
        },
        error: (error) => {
            this.snackBar.open('Failed to download resource', 'Close', {duration: 3000});
        }
    });
  }


  //update progress code by me
  isSectionCompleted(sectionIndex: number): boolean {
    return this.completedSections.includes(sectionIndex.toString());
  }

  loadCourseProgress(): void {
    this.studentCourseService.getCourseProgress(this.courseId).subscribe({
      next: (progress) => {
        if (progress) {
          this.currentSection = parseInt(progress.currentSection) || 0;
          this.completedSections = progress.completedSections || [];
          this.previousOverallProgress = progress.overallProgress || 0;


          if(progress.overallProgress==100){
            this.generateCertificate()
          }

          //autoscroll
          setTimeout(() => {
            const currentSectionElement = document.getElementById(`section-${this.currentSection}`);
            if (currentSectionElement) {
              currentSectionElement.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      },
      error: (error) => {
        console.error('Failed to load course progress:', error);
      }
    });
  }





  //for generating certificates
  private generateCertificate(): void {
    this.certificateService.generateCertificate(this.courseId).subscribe({
      next: (response) => {
        this.snackBar.open('Congratulations! Course completed. Your certificate is ready!', 'View', {
          duration: 6000
        }).onAction().subscribe(() => {
          window.open(response.certificateUrl, '_blank');
        });
      },
      error: (error) => {
        if (error.status === 409) { // If certificate already exists
          this.snackBar.open('Certificate already exists for this course', 'Close', {
            duration: 3000
          });
        } else {
          console.error('Certificate generation error:', error);
          this.snackBar.open('Failed to generate certificate', 'Close', {
            duration: 3000
          });
        }
      }
    });
  }



  
  selectSection(sectionIndex: number): void {
    // Only allow selecting if the section is not locked
    if (!this.isLocked(sectionIndex)) {
      this.currentSection = sectionIndex;
      
      // If we have a video player reference, reset it for the new section
      if (this.videoPlayer && this.videoPlayer.nativeElement) {
        // Reset the video to start playing the new section
        setTimeout(() => {
          this.videoPlayer.nativeElement.load();
          // Optionally auto-play
          // this.videoPlayer.nativeElement.play();
        }, 100);
      }
    } else {
      this.snackBar.open('Complete previous sections first to unlock this content', 'Close', {duration: 3000});
    }
  }
  
  
  
}
