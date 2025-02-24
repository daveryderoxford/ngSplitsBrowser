import { Component, input } from '@angular/core';
import { SidenavButtonComponent } from './sidenav-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-toolbar',
    template: `
    <mat-toolbar>
      <app-sidenav-button/> 
      <span class="title" >{{title()}}</span>
      <ng-content/>
      <div class=spacer></div>
      <ng-content select="[end]" />
    </mat-toolbar>
    `,
    imports: [MatToolbarModule, SidenavButtonComponent],
    styles: ` 
    .title {
       margin-right: 7px;
       margin-left: 7px;
    }

    .spacer {
       flex: 1 1 auto;
    }
    `
})
export class ToolbarComponent {

    title = input.required<string>();

}
