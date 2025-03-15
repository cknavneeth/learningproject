import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminsidebarComponent } from '../../common/adminsidebar/adminsidebar.component';
import { CommonModule } from '@angular/common';
import { HeaderadminComponent } from '../../common/headeradmin/headeradmin.component';


@Component({
  selector: 'app-adminlayout',
  standalone:true,
  imports: [RouterModule,AdminsidebarComponent,CommonModule,HeaderadminComponent],
  templateUrl: './adminlayout.component.html',
  styleUrl: './adminlayout.component.scss'
})
export class AdminlayoutComponent {
   showLayout=true

   constructor(private route:Router){
       this.route.events.subscribe(()=>{
        const authroutes=['admin/login']
        this.showLayout=!authroutes.includes(this.route.url.slice(1))
       })
   }
}
