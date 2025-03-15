import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmationcomponent',
  standalone:true,
  imports: [],
  templateUrl: './confirmationcomponent.component.html',
  styleUrl: './confirmationcomponent.component.scss'
})
export class ConfirmationcomponentComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationcomponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); 
  }

  onCancel(): void {
    this.dialogRef.close(false); 
  }
}
