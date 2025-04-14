import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/studentservice/cart/cart.service';
import { StudentcouponService } from '../../../services/studentservice/coupon/studentcoupon.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
      private router:Router
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
        const price=item.courseId.offer?item.courseId.price*(1-item.courseId.offer.percentage/100):item.courseId.price
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
      this.router.navigate(['/student/payment'],{
        state:{
          amount:this.total,
          items:this.cartItems,
          coupon:this.selectedCoupon
        }
      })
    }


    getCouponDescription(coupon:any):string{
      if (coupon.type === 'percentage') {
        return `${coupon.value}% off${coupon.maxDiscountAmount ? ' up to ₹' + coupon.maxDiscountAmount : ''}`;
      }
      return `₹${coupon.value} off`;
    }
}
