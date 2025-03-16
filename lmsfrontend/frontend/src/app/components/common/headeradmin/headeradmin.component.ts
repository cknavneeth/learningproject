import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { AdminserviceService } from '../../../services/adminservice.service';
import { TokenserviceService } from '../../../services/tokenservice.service';

@Component({
  selector: 'app-headeradmin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './headeradmin.component.html',
  styleUrl: './headeradmin.component.scss'
})
export class HeaderadminComponent {
  showProfileMenu = false;
  isDarkMode = false;

  constructor(private sidebarService: SidebarService,private tokenService:TokenserviceService,private adminservice:AdminserviceService,private router:Router) { }

  ngOnInit(): void {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu(): void {
    this.showProfileMenu = false;
  }

  toggleTheme(): void {
    if (document.documentElement.classList.contains('dark')) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  enableDarkMode(): void {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    this.isDarkMode = true;
  }

  disableDarkMode(): void {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    this.isDarkMode = false;
  }


  
  logoutadmin() {
    this.adminservice.logoutAdmin().subscribe({
      next: () => {
        // Remove navigation delay and force page reload
        this.router.navigate(['/admin/login'])
          .then(() => {
            window.location.reload();
          });
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.tokenService.removeAdminToken();
        this.router.navigate(['/admin/login'])
          .then(() => {
            window.location.reload();
          });
      }
    });
  }
  
}
