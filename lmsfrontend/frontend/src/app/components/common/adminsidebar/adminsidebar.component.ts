import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-adminsidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './adminsidebar.component.html',
  styleUrl: './adminsidebar.component.scss'
})
export class AdminsidebarComponent implements OnInit {
  showSidebar = false;

  constructor(private sidebarService: SidebarService) {}

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
}
