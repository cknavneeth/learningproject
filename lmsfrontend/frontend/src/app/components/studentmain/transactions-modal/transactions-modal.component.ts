import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Transaction } from '../../../interfaces/wallet.interface';
import { WalletService } from '../../../services/studentservice/wallet/wallet.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transactions-modal',
  imports: [FormsModule,CommonModule,MatIconModule],
  templateUrl: './transactions-modal.component.html',
  styleUrl: './transactions-modal.component.scss'
})
export class TransactionsModalComponent  implements OnInit{
        isLoading=false
        constructor(
          private dialogRef:MatDialogRef<TransactionsModalComponent>,
          @Inject(MAT_DIALOG_DATA) public data:{transactions:Transaction[]},
          private walletService:WalletService
        ){}

        ngOnInit(): void {
          
        }

        close(): void {
          this.dialogRef.close();
        }
    
    
    
    getTransactionIcon(type: string): string {
      return type === 'credit' ? 'arrow_upward' : 'arrow_downward';
    }
    
    getTransactionClass(type: string): string {
      return type === 'credit' ? 'text-green-500' : 'text-red-500';
    }
}
