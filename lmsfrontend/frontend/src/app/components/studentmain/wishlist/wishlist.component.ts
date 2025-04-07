import { Component } from '@angular/core';
import { WishlistService } from '../../../services/studentservice/wishlist/wishlist.service';
import { CartService } from '../../../services/studentservice/cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationcomponentComponent } from '../../common/confirmationcomponent/confirmationcomponent.component';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wishlist',
  imports: [MatIconModule,MatProgressSpinner,CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
   wishlistItems:any[]=[]
   loading:boolean=false
   error:string=''
   addingToCart:boolean=false

   constructor(private wishlistService:WishlistService,
    private cartService:CartService,
    private snackBar:MatSnackBar,
    private dialog:MatDialog,
    private router:Router
   ){}

   ngOnInit():void{
    this.loadWishlist()
   }


   loadWishlist(){
    this.loading=true
    this.wishlistService.getWishlist().subscribe(
      response=>{
        this.wishlistItems=response.courses||[]
        this.loading=false
      },
      error=>{
        this.error='Failed to load wishlist'
        this.loading=false
      }
    )
   }


   removeFromWishlist(courseId:string,courseName:string){
    const dialogRef=this.dialog.open(ConfirmationcomponentComponent,{
      data:{
        title:'Confirm Removal',
        message:`Are you sure you want to remove "${courseName}" from your wishlist?`
      }
    })
    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.wishlistService.removeFromWishlist(courseId).subscribe(
          response=>{
            this.wishlistItems=this.wishlistItems.filter(item=>item._id!==courseId)
              this.snackBar.open('Course removed from wishlist successfully!','Close',{
                duration:3000,
                horizontalPosition:'right',
                verticalPosition:'top'
              })
          },
          error=>{
            this.snackBar.open('Failed to remove course from wishlist','Close',{
              duration:3000,
              horizontalPosition:'right',
              verticalPosition:'top'
            })
          }
        )
      }
    })
   }



   addToCart(courseId: string) {
    if (this.addingToCart) return;

    this.addingToCart = true;
    this.cartService.addToCart(courseId).subscribe(
      response => {
        this.snackBar.open('Course added to cart successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });


        this.removeFromWishlistSilently(courseId);
        this.addingToCart = false;
      },
      error => {
        const errorMessage = error.error?.message || 'Failed to add course to cart';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.addingToCart = false;
      }
    );
  }



  navigateToCourse(courseId: string) {
    this.router.navigate(['/student/courses', courseId]);
  }

  private removeFromWishlistSilently(courseId: string) {
    this.wishlistService.removeFromWishlist(courseId).subscribe(
      response => {
        this.wishlistItems = this.wishlistItems.filter(item => item._id !== courseId);
      },
      error => {
        this.snackBar.open('Failed to update wishlist', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    );
  }



}
