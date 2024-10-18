import { Component, OnInit, input } from '@angular/core';
import { SidenavButtonComponent } from './sidenav-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-toolbar',
    template: `
<mat-toolbar>
   <app-sidenav-button  /> <ng-content  />
</mat-toolbar>
    `,
    standalone: true,
    imports: [MatToolbarModule, SidenavButtonComponent]
})
export class ToolbarComponent {

   title = input();

   constructor (  ) { }
}
