import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentcourseService } from '../../../services/studentservice/course/studentcourse.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../../services/studentservice/cart/cart.service';

@Component({
  selector: 'app-course-detail',
  imports: [ 
    CommonModule, 
    MatProgressSpinnerModule,
    MatExpansionModule ,
    MatIconModule
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent {

  courseDetails:any
  loading:boolean=false
  error:string=''
  addingToCart:boolean=false

  constructor(private route:ActivatedRoute,private studentCourseService:StudentcourseService,private snackBar:MatSnackBar,private cartService:CartService){}

  ngOnInit():void{
    this.loading=true
   const courseId=this.route.snapshot.paramMap.get('id')

    if(courseId){
      this.studentCourseService.getCourseById(courseId).subscribe(
        response=>{
          this.courseDetails=response
          this.loading=false
        },
        error=>{
          this.error='Failed to load course details'
          this.loading=false
        }
      )
    }
  }



  getTotalLectures(): number {
    return this.courseDetails?.sections?.reduce((total: number, section: any) => 
      total + (section.resources?.length || 0) + 1, 0) || 0;
  }

  getTotalDuration(): string {
    const totalMinutes = this.courseDetails?.sections?.reduce((total: number, section: any) => 
      total + (section.duration || 0), 0) || 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }


  addToCart(){
    if(this.addingToCart||!this.courseDetails?._id)
      return 

    this.addingToCart=true
    this.cartService.addToCart(this.courseDetails._id).subscribe(
      response=>{
        this.snackBar.open('Course added to Cart successfully!','Close',{
          duration:3000,
          horizontalPosition:'right',
          verticalPosition:'top'
        })
      },
        error=>{
          console.log('error entha cartil',error.error.message,error)
          const errorMessage = error.error?.message === 'Course already in cart' 
          ? 'This course is already in your cart' 
          : 'Failed to add course to cart';
          this.snackBar.open(errorMessage,'Close',{
            duration:3000,
            horizontalPosition:'right',
            verticalPosition:'top'
          })
        }
    )
  }
   

}
