import { Component } from '@angular/core';
import { AdminserviceService } from '../../../services/adminservice.service';
import { InstructorauthserviceService } from '../../../services/instructorauthservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homeins',
  imports: [],
  templateUrl: './homeins.component.html',
  styleUrl: './homeins.component.scss'
})
export class HomeinsComponent {

  constructor(private service:InstructorauthserviceService,private router:Router){}
    logoutinstructor(){
      this.service.logoutinstructor().subscribe(
        response => {
          this.router.navigate(['/instructor/instructorlogin']);
        }
      );
    }
}
