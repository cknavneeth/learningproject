import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminsidebarComponent } from '../../common/adminsidebar/adminsidebar.component';

@Component({
  selector: 'app-adminlayout',
  imports: [RouterModule,AdminsidebarComponent],
  templateUrl: './adminlayout.component.html',
  styleUrl: './adminlayout.component.scss'
})
export class AdminlayoutComponent {

}
