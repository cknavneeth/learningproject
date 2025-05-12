import { Component, OnInit, NgZone } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/studentservice/cart/cart.service';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { WishlistService } from '../../../services/studentservice/wishlist/wishlist.service';
import { MatDialog } from '@angular/material/dialog';
import { WalletmodalComponent } from '../../studentmain/walletmodal/walletmodal.component';
import { WalletService } from '../../../services/studentservice/wallet/wallet.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  menuOpen: boolean = false;
  cartItemCount$:Observable<number>
  wishlistItemCount$:Observable<number>

  constructor(
    private service: AuthserviceService,
    private router: Router,
    private ngZone: NgZone,
    private cartService:CartService,
    private wishlistService:WishlistService,
    private dialog: MatDialog,
    private walletService:WalletService
  ) {

    this.cartItemCount$=this.cartService.cartItems$
    this.wishlistItemCount$=this.wishlistService.wishlistItems$
    
    window.addEventListener('storage', (event) => {
      if (event.key === 'studentaccesstoken') {
        this.ngZone.run(() => {
          this.checkAuthStatus();
        });
      }
    });


    
  }

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const access = this.service.getAccessToken();
    this.isAuthenticated = !!access;
  }

  logout() {
    this.service.logoutthestudent().subscribe(
      response => {
        this.isAuthenticated = false;
        this.router.navigate(['/student/login']);
      }
    );
  }

  togglemenu() {
    this.menuOpen = !this.menuOpen;
  }


  openWalletModal(): void {
    this.walletService.getWalletBalance().subscribe({
      next: (response) => {
        this.dialog.open(WalletmodalComponent, {
          width: '400px',
          data: { wallet: response.wallet },
          panelClass: 'wallet-modal-container'
        });
      },
      error: (error) => {
        console.error('Error fetching wallet balance:', error);
        // Show a fallback with zero balance
        this.dialog.open(WalletmodalComponent, {
          width: '400px',
          data: { wallet: 0 },
          panelClass: 'wallet-modal-container'
        });
      }
    });
  }
}


