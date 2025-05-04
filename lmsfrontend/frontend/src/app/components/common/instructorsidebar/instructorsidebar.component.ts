import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-instructorsidebar',
  imports: [RouterModule,CommonModule],
  templateUrl: './instructorsidebar.component.html',
  styleUrl: './instructorsidebar.component.scss'
})
export class InstructorsidebarComponent {
   @Input() isOpen = false;

   menuItems = [
    
    { icon: 'fas fa-tachometer-alt', label: 'Dashboard', route: '/instructor/dashboard' },
    { icon: 'fas fa-plus-circle', label: 'Create Course', route: '/instructor/courses' },
    { icon: 'fas fa-book', label: 'My Courses', route: '/instructor/my-courses' },
    { icon: 'fas fa-dollar-sign', label: 'Earnings', route: '/instructor/earnings' },
    { icon: 'fas fa-envelope', label: 'Messages', route: '/instructor/messages' },
    {icon:'fas fa-file-alt' ,label:'Your Draft',route:'/instructor/drafts'},
    {icon:'fas fa-user' ,label:'My Students',route:'/instructor/enrolled-students'},
    {icon:'fas fa-user' ,label:'Community',route:'/instructor/community'}
  ];
}
