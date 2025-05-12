import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WalletService } from '../../../services/studentservice/wallet/wallet.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-walletmodal',
  imports: [CommonModule,MatButtonModule,MatIconModule],
  templateUrl: './walletmodal.component.html',
  styleUrl: './walletmodal.component.scss'
})
export class WalletmodalComponent {

  constructor(
    private dialogRef:MatDialogRef<WalletmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{wallet:number},
    private walletService:WalletService,
    private snackBar:MatSnackBar
  ){}

  close(): void {
    this.dialogRef.close();
  }
}
