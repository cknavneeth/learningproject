import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../../services/studentservice/payment/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payout',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './payout.component.html',
  styleUrl: './payout.component.scss'
})
export class PayoutComponent {

  
  @Output() close=new EventEmitter()


    payoutForm!:FormGroup
    constructor(
      private fb:FormBuilder,private paymentService:PaymentService,private snackBar:MatSnackBar
    ){
      this.payoutForm=this.fb.group({
        name:['',[Validators.required,Validators.minLength(3)]],
        email:['',[Validators.required,Validators.email]],
        phone:['',[Validators.minLength(10),Validators.maxLength(10)]],
        ifsc:['',[Validators.required,Validators.maxLength(11),Validators.pattern( /^[A-Z]{4}0[A-Z0-9]{6}$/ )]],
        accountNumber:['',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
        accountHolderName:['',[Validators.minLength(3)]]
      })

      console.log('eda mode payout ahn')
    }

    
    onSubmit(){
       if(this.payoutForm.invalid){
        return 
       }

       this.paymentService.createpayoutDetails(this.payoutForm.value).subscribe({
        next:(response)=>{
            this.snackBar.open('Payout registered','close',{
              duration:3000
            })
        },
        error:(error)=>{
             this.snackBar.open(error.error.message,'close',{
              duration:3000
            })
        }
       })
    }

    closeModal(){
       this.close.emit()
    }
    
}
