import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { AdminserviceService } from '../../../services/adminservice.service';
import { TokenserviceService } from '../../../services/tokenservice.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-adminsidebar',
  standalone: true,
  imports: [CommonModule, RouterModule,MatIconModule],
  templateUrl: './adminsidebar.component.html',
  styleUrl: './adminsidebar.component.scss'
})
export class AdminsidebarComponent implements OnInit {
  showSidebar = false;

  constructor(private sidebarService: SidebarService,private router:Router,private adminservice:AdminserviceService,private tokenService:TokenserviceService) {}

  ngOnInit() {
    this.sidebarService.showSidebar$.subscribe(
      (state) => {
        this.showSidebar = state;
      }
    );
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }


  logoutadmin(){
    
      this.adminservice.logoutAdmin().subscribe({
        next:(response)=>{
          this.tokenService.removeAdminToken();
          this.router.navigate(['/admin/login'], { replaceUrl: true });
        },
        error:(error)=>{
          console.log(error)
          console.error('Logout error:', error);
          this.tokenService.removeAdminToken();
          this.router.navigate(['/admin/login'], { replaceUrl: true });
        } 
      })
  }
  

}
