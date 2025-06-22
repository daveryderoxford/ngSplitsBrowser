import { Component, input } from '@angular/core';
import { SidenavButton } from './sidenav-button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-toolbar',
    template: `
    <mat-toolbar class="gap10">
      <app-sidenav-button/> 
      <span class="title" >{{title()}}</span>
      <ng-content/>
      <div class=spacer></div>
      <ng-content select="[end]" />
    </mat-toolbar>
    `,
    imports: [MatToolbarModule, SidenavButton],
    styles: ` 
    .title {
       margin-right: 7px;
       margin-left: 7px;
    }

    .gap10 {
        gap: 10px;
    }

    .spacer {
       flex: 1 1 auto;
    }
    `
})
export class Toolbar {

    title = input.required<string>();

}
