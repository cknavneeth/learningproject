import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/common/header/header.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent,FooterComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showLayout=true
  constructor(private router:Router){
    this.router.events.subscribe(()=>{
      const authroutes=['/register','/login','/sentotp']
      this.showLayout=!authroutes.includes(this.router.url)
    })
  }
}
