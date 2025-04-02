import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { InstructorheaderComponent } from '../../common/instructorheader/instructorheader.component';
import { InstructorsidebarComponent } from '../../common/instructorsidebar/instructorsidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructorcomponent',
  standalone:true,
  imports: [RouterOutlet,InstructorheaderComponent,InstructorsidebarComponent,CommonModule],
  templateUrl: './instructorcomponent.component.html',
  styleUrl: './instructorcomponent.component.scss'
})
export class InstructorcomponentComponent {

    showLayout=true
    isSidebarOpen=false

    constructor(private router:Router){
      this.router.events.subscribe(()=>{
        const authroutes=['instructor/instructorlogin','instructor/register','instructor/sentotp','instructor/instructorotp']
        this.showLayout=!authroutes.includes(this.router.url.slice(1))
      })
    }


    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }

}
