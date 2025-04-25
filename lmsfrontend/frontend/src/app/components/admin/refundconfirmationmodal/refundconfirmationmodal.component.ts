import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-refundconfirmationmodal',
  imports: [
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './refundconfirmationmodal.component.html',
  styleUrl: './refundconfirmationmodal.component.scss'
})
export class RefundconfirmationmodalComponent {

  constructor(
    public dialogRef:MatDialogRef<RefundconfirmationmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{
      orderId:string,
      courseId:string,
      amount:number
    }
  ){}


  onCancel():void{
    this.dialogRef.close(false)
  }

  onConfirm():void{
    this.dialogRef.close(true)
  }
}
