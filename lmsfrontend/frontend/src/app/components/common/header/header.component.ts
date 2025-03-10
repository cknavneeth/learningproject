import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
      isAuthenticated=false
      menuOpen:boolean=false

      constructor(private service:AuthserviceService,private router:Router){}

      ngOnInit(): void {
         let accesss= this.service.getAccessToken()
         if(accesss){
          this.isAuthenticated=true
         }else{
          this.isAuthenticated=false
         }

          
      }

      logout(){
          this.service.logoutthestudent().subscribe(
            response=>{
              this.router.navigate(['/login'])
            }
          )
      }
      togglemenu(){
        this.menuOpen=!this.menuOpen
      }
}
