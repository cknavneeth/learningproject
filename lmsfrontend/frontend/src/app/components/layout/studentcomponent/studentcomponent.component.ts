import { Component } from '@angular/core';
import { HeaderComponent } from '../../common/header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-studentcomponent',
  imports: [RouterOutlet,HeaderComponent,FooterComponent,CommonModule],
  templateUrl: './studentcomponent.component.html',
  styleUrl: './studentcomponent.component.scss'
})
export class StudentcomponentComponent {
  showLayout = true;
  
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const authroutes = ['student/register', 'student/login', 'student/sentotp','student/forgotpassword'];
      this.showLayout = !authroutes.includes(this.router.url.slice(1)); 
    });
  }
}
