import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentcourseService } from '../../../services/studentservice/course/studentcourse.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../../services/studentservice/cart/cart.service';
import { WishlistService } from '../../../services/studentservice/wishlist/wishlist.service';
import { ReviewService } from '../../../services/studentservice/review/review.service';
import { Review } from '../../../interfaces/review.interface';

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
  addingToWishlist:boolean=false
  isInWishlist:boolean=false

  reviews:Review[]=[]

  constructor(private route:ActivatedRoute,private studentCourseService:StudentcourseService,private snackBar:MatSnackBar,private cartService:CartService,private wishlistService:WishlistService,private reviewService:ReviewService){}

  ngOnInit():void{
    this.loading=true
   const courseId=this.route.snapshot.paramMap.get('id')

    if(courseId){
      this.studentCourseService.getCourseById(courseId).subscribe(
        response=>{
          this.courseDetails=response
          this.loading=false
          this.loadReviews()
        },
        error=>{
          this.error='Failed to load course details'
          this.loading=false
        }
      )
    }

    this.checkWishlistStatus()
    
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
        this.addingToCart = false;
      const backendMessage = error.error?.message;
      console.log('backendMessage',error.error?.message)
      
      let errorMessage = 'Failed to add course to cart';

      // Check for specific error messages
      switch (backendMessage) {
        case 'Course already in cart':
          errorMessage = 'This course is already in your cart';
          break;

        case 'You are blocked from performing this action':
          errorMessage = 'You are blocked from using the platform';
          break;

      }




          this.snackBar.open(errorMessage,'Close',{
            duration:3000,
            horizontalPosition:'right',
            verticalPosition:'top'
          })
        }
    )
  }



   

  private checkWishlistStatus(){
    this.wishlistService.getWishlist().subscribe(
      response=>{
        this.isInWishlist=response.courses.some((course:any)=>course._id===this.courseDetails._id)
      },
      error=>{
        console.log('error checking wishlist status',error)
      }
    )
  }


  toggleWishlist(){
    if(this.addingToWishlist||!this.courseDetails?._id)return

    this.addingToWishlist=true

    const operation=this.isInWishlist?this.wishlistService.removeFromWishlist(this.courseDetails._id)
      :this.wishlistService.addToWishlist(this.courseDetails._id)

      operation.subscribe(
        response=>{
          this.isInWishlist=!this.isInWishlist
          const message=this.isInWishlist
          ?'Course added to wishlist successfully!'
          :'Course removed from wishlist successfully!'
          this.snackBar.open(message,'Close',{
            duration:3000,
            horizontalPosition:'right',
            verticalPosition:'top'
          })
        },
        error=>{
          const errorMessage = error.error?.message || 'Failed to update wishlist';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.addingToWishlist = false;
        }
      )
    
  }


  //for showing reviews here
  private loadReviews(){
    const courseId=this.route.snapshot.paramMap.get('id')
    if(courseId){
      this.reviewService.getReviewsByCourse(courseId).subscribe(
        response=>{
          this.reviews=response
          console.log('loaded reviews',this.reviews)
        },
        error=>{
          console.log('error loading reviews',error)
        }
      )
    }
  }


  getAverageRating(): number {
    if (!this.reviews || this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }


}
