import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/studentservice/cart/cart.service';
import { StudentcouponService } from '../../../services/studentservice/coupon/studentcoupon.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { ConfirmationcomponentComponent } from '../../common/confirmationcomponent/confirmationcomponent.component';
import { PaymentService } from '../../../services/studentservice/payment/payment.service';

@Component({
  selector: 'app-checkout',
  imports: [ CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{
    cartItems:any[]=[]
    availableCoupons:any[]=[]
    loading={
      cart:true,
      coupons:true
    }

    subtotal:number=0
    discount:number=0
    total:number=0

    selectedCoupon:any=null
    showCouponList:boolean=false


    constructor(
      private cartService:CartService,
      private couponService:StudentcouponService,
      private snackBar:MatSnackBar,
      private router:Router,
      private dialogue:MatDialog,
      private paymentService:PaymentService
    ){}

    ngOnInit(){
      this.loadCheckoutDetails()
    }


    loadCheckoutDetails(){
      this.loading.cart=true
      this.cartService.getCart().subscribe(
        response=>{
          this.cartItems=response.items||[]
          this.calculateTotals()
          this.loadAvailableCoupons()
          this.loading.cart=false
          console.log('loading checkout details',response)
          console.log('cart item in checkout',this.cartItems) 
        },
        error=>{
          this.snackBar.open('Failed to load cart items','Close',{duration:3000})
          this.loading.cart=false
        }
      )
    }


    loadAvailableCoupons(){
      this.loading.coupons=true
      this.couponService.getAvailableCoupons(this.subtotal).subscribe(
        response=>{
          this.availableCoupons=response.coupons
          this.loading.coupons=false
          console.log(response.coupons,'coupon vende nink')
          console.log(this.availableCoupons,'nink olla coupons')
        },
        error=>{
          this.snackBar.open('Failed to load coupons','Close',{duration:3000})
          this.loading.coupons=false
        }
      )
    }


    calculateTotals(){
      this.subtotal=this.cartItems.reduce((sum,item)=>{
        const price=item.courseId.offer?item.courseId.offer.discountPrice:item.courseId.price
        return sum+price
      },0)

      if(this.selectedCoupon){
        if(this.selectedCoupon.type==='percentage'){
          this.discount=(this.subtotal*this.selectedCoupon.value)/100
          if(this.selectedCoupon.maxDiscountAmount){
            this.discount=Math.min(this.discount,this.selectedCoupon.maxDiscountAmount)
          }
        }else{
          this.discount=this.selectedCoupon.value
        }
      }else{
        this.discount=0
      }

      this.total=this.subtotal-this.discount
    }




    toggleCouponList(){
      this.showCouponList=!this.showCouponList
    }

    applyCoupon(coupon:any){
        this.couponService.validateCoupon(coupon.code,this.subtotal).subscribe({
          next:(response)=>{
            this.selectedCoupon=coupon
            this.calculateTotals()
            this.showCouponList=false
            this.snackBar.open('Coupon applied successfully!','Close',{duration:3000})
          },
          error:(error)=>{
            this.snackBar.open(error.error.message||'Failed to apply coupon','Close',{
              duration:3000
            })
          }
        })
    }



    removeCoupon(){
      this.selectedCoupon=null
      this.calculateTotals()
      this.snackBar.open('Coupon removed','Clode',{duration:3000})
    }


    proceedToPayment(){
        const dialogRef=this.dialogue.open(PaymentModalComponent,{
          width:'500px',
          data:{
            amount:this.total,
            items:this.cartItems,
            coupon:this.selectedCoupon
          },
          panelClass:['payment-modal-container','animate__animated', 'animate__fadeInUp'],
          backdropClass:'payment-modal-backdrop'
        })


        dialogRef.afterClosed().subscribe(result=>{
          if(result?.success){
            this.cartService.clearCart().subscribe({
              next:()=>{
                this.router.navigate(['/student/courses'])
              },
              error:(error)=>{
                console.error('error clearing cart',error)
              }
            })
          }
        })
    }


    getCouponDescription(coupon:any):string{
      if (coupon.type === 'percentage') {
        return `${coupon.value}% off${coupon.maxDiscountAmount ? ' up to ₹' + coupon.maxDiscountAmount : ''}`;
      }
      return `₹${coupon.value} off`;
    }


    proceedToWallet(){
      const dialogRef=this.dialogue.open(ConfirmationcomponentComponent,{
          width:'500px',
          data:{
            title:'Wallet payment',
            message:'Are you sure to make payment?'
          }

      })


      dialogRef.afterClosed().subscribe((result)=>{
         console.log('Dialog result:', result);
        if(result==true){
             console.log('Proceeding with wallet payment...');
             console.log('consoling cart items for wallet payment',this.cartItems)
             const items=this.cartItems.map((item)=>item.courseId._id)
             console.log('wallet items console',items)
             

            this.paymentService.walletPayment({amount:this.total,items:items,coupon:this.selectedCoupon}).subscribe({
              next:(response)=>{
                  console.log('wallet response',response)
                  this.snackBar.open('Successfully Purchased','close',{duration:3000})
              },
              error:(error)=>{
                  console.log('wallet payment error',error)
              }
            })
        }
      })
    }
}
