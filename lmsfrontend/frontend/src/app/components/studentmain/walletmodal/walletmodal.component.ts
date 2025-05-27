import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WalletService } from '../../../services/studentservice/wallet/wallet.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Transaction } from '../../../interfaces/wallet.interface';
import { TransactionsModalComponent } from '../transactions-modal/transactions-modal.component';

@Component({
  selector: 'app-walletmodal',
  imports: [CommonModule,MatButtonModule,MatIconModule],
  templateUrl: './walletmodal.component.html',
  styleUrl: './walletmodal.component.scss'
})
export class WalletmodalComponent implements OnInit{

  transactions:Transaction[]=[]
  isLoading=false
  

  constructor(
    private dialogRef:MatDialogRef<WalletmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{wallet:number},
    private walletService:WalletService,
    private snackBar:MatSnackBar,
    private dialog:MatDialog,
    
  ){}

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit():void{
    this.loadTransactions()
  }

  loadTransactions():void{
    this.isLoading=true
    this.walletService.getRecentTransactions().subscribe(
      response=>{
         if (Array.isArray(response)) {
        this.transactions = response;
      } 
      // Check if response has transactions property
      else if (response && response.transactions) {
        this.transactions = response.transactions;
      } 
      // If neither, set to empty array
      else {
        this.transactions = [];
        console.error('Unexpected response format:', response);
      }
      this.isLoading = false;
          this.isLoading=false
      },error=>{
           
        this.isLoading=false
        this.snackBar.open('failed to load transactions','Close',{duration:3000})
      }
    )
  }


  

  openTransactionsModal():void{

    this.dialog.open(TransactionsModalComponent,{
      width:'500px',
      data:{transactions:this.transactions},
      panelClass:'transactions-modal-container'
    })
  }


}
