import { Component, OnInit, NgZone } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  menuOpen: boolean = false;

  constructor(
    private service: AuthserviceService,
    private router: Router,
    private ngZone: NgZone
  ) {
    
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
}


