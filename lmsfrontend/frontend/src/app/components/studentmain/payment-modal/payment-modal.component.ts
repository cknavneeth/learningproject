import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from '../../../services/studentservice/payment/payment.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';



declare var Razorpay: any;

@Component({
  selector: 'app-payment-modal',
  imports: [CommonModule,MatButtonModule,MatIconModule],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.scss'
})
export class PaymentModalComponent {

  private readonly razorpayKeyId =environment.RAZORPAY_KEY_ID;


     constructor(
      private dialogRef:MatDialogRef<PaymentModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data:any,
      private paymentService:PaymentService,
      private snackBar:MatSnackBar,
      
     ){}


     close(){
      this.dialogRef.close()
     }

     initiateRazorpayPayment(){

      //for debug
      const amount = typeof this.data.amount === 'string' 
      ? parseFloat(this.data.amount) 
      : this.data.amount;

  if (isNaN(amount) || amount <= 0) {
      this.snackBar.open('Invalid amount', 'Close', { duration: 3000 });
      return;
  }

  console.log('Payment amount before conversion:', amount);

  const orderData = {
    amount: amount,
    currency: 'INR',
    items: Array.isArray(this.data.items) ? this.data.items : [],
    coupon: this.data.coupon || null
  };

  console.log('Initiating payment with data:', orderData); 


      this.paymentService.createOrder({
        amount:this.data.amount,
        items:this.data.items,
        coupon:this.data.coupon
      }).subscribe({
        next:(orderData)=>{
          console.log('Order created:', orderData); 
          const options={
            key:this.razorpayKeyId,
            amount: orderData.amount,
          currency: 'INR',
          name: 'ScholarSync',
          description: 'Course Purchase',
          order_id: orderData.id,
          handler: (response: any) => {
            console.log('Payment success:', response);
            // this.verifyPayment(response, orderData.orderId);
            this.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: orderData.id, 
              razorpay_signature: response.razorpay_signature
            },orderData.id)
          },
          prefill: {
            email: orderData.email,
            contact: orderData.phone
          },
          theme: {
            color: '#3B82F6'
          }

          }

          const rzp=new Razorpay(options)
          rzp.open()
        },
        error:(error)=>{
          this.snackBar.open('Failed to initiate payment','Close',{duration:3000})
        }

      })
     }



     private verifyPayment(razorpayResponse:any, orderId:string) {
      console.log('Verifying payment with response:', razorpayResponse);
      this.paymentService.verifyPayment({
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      }).subscribe({
        next: (response) => {
          console.log('Verification successful:', response);
          this.showSuccessAlert()
          this.dialogRef.close({success: true});
        },
        error: (error) => {
          console.error('Verification error:', error);
          this.snackBar.open('Payment verification failed', 'Close', {
            duration: 3000
          });
        }
      });
     }  





     private showSuccessAlert() {
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        text: 'Your course purchase has been completed.',
        confirmButtonText: 'Start Learning',
        confirmButtonColor: '#3B82F6',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        background: '#fff',
        customClass: {
          title: 'swal2-title-custom',
          htmlContainer: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-button-custom'
        },
        timer: 5000,
        timerProgressBar: true,
        allowOutsideClick: false
      });
    }

    
}


