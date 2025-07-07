import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../../services/studentservice/payment/payment.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-withdraw',
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.scss'
})
export class WithdrawComponent {

  withdrawForm!:FormGroup

  isSubmitted:boolean=false

  @Output() close=new EventEmitter()

  constructor(
    private fb:FormBuilder,
    private paymentService:PaymentService,
    private matSnackBar:MatSnackBar
  ){
     this.withdrawForm=this.fb.group({
      amount:['',[Validators.required,Validators.min(10000)]]
     })
  }


  withdrawSubmit(){
    const amount=this.withdrawForm.value.amount
    this.isSubmitted=true
    this.paymentService.withdrawMoney(amount).subscribe({
      next:(response)=>{
          this.matSnackBar.open('withdrawal success','close',{
            duration:3000
          })
      },
      error:(error)=>{
         this.matSnackBar.open(error?.error.message,'close',{
          duration:3000
         })
         console.log('withdrawal error',error)
      }
    })
  }

  closeModal(){
    this.close.emit()
  }


}
