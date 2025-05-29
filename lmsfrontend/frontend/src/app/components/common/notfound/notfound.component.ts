import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-notfound',
  imports: [RouterModule,CommonModule],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.scss'
})
export class NotfoundComponent {
     isStudentTrue=false
     isInstructorTrue=false
     isAdminTrue=false
     constructor(private router:Router){
      if(this.router.url.includes('/student')){
         this.isStudentTrue=true
      }else if(this.router.url.includes('/instructor')){
         this.isInstructorTrue=true
      }else if (this.router.url.includes('/admin')){
        this.isAdminTrue=true
      }
     }

     

     
}
