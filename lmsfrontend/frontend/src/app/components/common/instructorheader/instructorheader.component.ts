import { Component, EventEmitter, Output } from '@angular/core';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructorheader',
  imports: [CommonModule],
  templateUrl: './instructorheader.component.html',
  styleUrl: './instructorheader.component.scss'
})
export class InstructorheaderComponent {
  showProfileMenu=false
  @Output() toggleSidebarEvent=new EventEmitter<void>()

   constructor(private service:InstructorauthserviceService,private router:Router){}
      logoutinstructor(){
        this.service.logoutinstructor().subscribe(
          response => {
            this.router.navigate(['/instructor/instructorlogin']);
          }
        );
      }

      toggleProfileMenu():void{
        this.showProfileMenu=!this.showProfileMenu
      }

      closeProfileMenu():void{
        this.showProfileMenu=false
      }

      toggleSidebar():void{
        this.toggleSidebarEvent.emit()
      }

}
