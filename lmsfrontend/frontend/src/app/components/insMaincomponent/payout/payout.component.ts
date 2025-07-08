import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../../services/studentservice/payment/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { payoutData, PayoutResponse } from '../../../interfaces/payout.interface';

@Component({
  selector: 'app-payout',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './payout.component.html',
  styleUrl: './payout.component.scss'
})
export class PayoutComponent {

  
  @Output() close=new EventEmitter()
  isEditMode:boolean=false


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

       if(this.isEditMode){
          
        this.paymentService.updateInstructorPayout(this.payoutForm.value).subscribe({
          next:()=>{
              this.snackBar.open('Edited successfully','close',{
                duration:3000
              })
              this.close.emit()
          },
          error:(error)=>{
              this.snackBar.open(error?.error?.message,'close',{
                duration:3000
              })
          }
        })

       }else{

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

       
    }

    closeModal(){
       this.close.emit()
    }


    ngOnInit(): void {
       this.loadPayoutDetails()
    }


    loadPayoutDetails(){
      this.paymentService.getInstructorPayout().subscribe({

        next:(data:payoutData)=>{
          console.log('payout details for instructur',data)
            if(data){
              this.isEditMode=true
              this.payoutForm.patchValue({
                name:data.name,
                email:data.email,
                phone:data.phone,
                ifsc:data.ifsc,
                accountNumber:data.accountNumber,
                accountHolderName:data.accountHolderName
              })
            }
        },
        error:()=>{
           this.isEditMode=false
        }

      })
    }



    
}
