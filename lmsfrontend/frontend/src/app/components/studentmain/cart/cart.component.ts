import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/studentservice/cart/cart.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ConfirmationcomponentComponent } from '../../common/confirmationcomponent/confirmationcomponent.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Cart, CartItem, CartResponse } from '../../../interfaces/cart.interface';

@Component({
  selector: 'app-cart',
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{
   cartItems:CartItem[]=[]
   loading:boolean=true
   error:string=''
   totalAmount:number=0


   constructor(private cartService:CartService,private snackBar:MatSnackBar,private dialog: MatDialog,private router:Router){}

   ngOnInit(){
    this.loadCart()
   }


   loadCart(){
    this.loading=true
    this.cartService.getCart().subscribe({
      next:(response)=>{
        this.loading=false
        this.cartItems=response.items||[]
        this.totalAmount=response.totalAmount||0
      },
      error:(error)=>{
           this.error='Failed to load cart'
           this.snackBar.open(this.error, 'Close', { duration: 3000 });
      }
    })
    // this.cartService.getCart().subscribe(
    //   response=>{
    //     console.log('My cart response',response)
    //     this.loading=false
    //     this.cartItems=response.items||[]
    //     this.totalAmount=response.totalAmount||0
    //   },
    //   error=>{
    //     this.error='Failed to load cart'
    //     this.snackBar.open(this.error, 'Close', { duration: 3000 });
    //   }
    // )
   }

   clearCart(){
       this.cartService.clearCart().subscribe(
        response=>{
          this.snackBar.open('Cart cleared successfully', 'Close', { duration: 3000 });
          this.loadCart()
        }
       )
   }

   proceedToCheckout(){
    if (this.cartItems.length === 0) {
      this.snackBar.open('Your cart is empty', 'Close', {
        duration: 3000
      });
      return;
    }
    
    this.router.navigate(['/student/checkout']);
   }

   removeItem(courseId:string,courseName:string){
    const dialogRef=this.dialog.open(ConfirmationcomponentComponent,{
      data:{
          title: 'Confirm Removal',
         message: `Are you sure you want to remove "${courseName}" from your cart?`
      }
    })
    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.cartService.removeFromCart(courseId).subscribe({
          next: (response) => {
            this.loadCart(); // Reload cart after removal
            this.snackBar.open('Item removed from cart', 'Close', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open('Failed to remove item from cart', 'Close', { duration: 3000 });
          }
        });
      }
    })
    
   }


}
