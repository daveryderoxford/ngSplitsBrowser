import { Component, input } from '@angular/core';
import { SidenavButtonComponent } from './sidenav-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-toolbar',
    template: `
    <mat-toolbar>
        <app-sidenav-button  /> 
        {{title()}}
        <div class=content>
            <ng-content />
        </div>
        <div class=spacer></div>
        <div class="end-content">
            <ng-content select="[end]" />
        </div>
    </mat-toolbar>
    `,
    standalone: true,
    imports: [MatToolbarModule, SidenavButtonComponent],
    styles: ` 
      .content { 
        display: flex; 
        align-items: center; 
        gap: 6px; 
        margin-left: 10px;
    }
      .end-content { 
        display: flex; 
        align-items: center;
        gap: 6px; 
        margin-right: 10px; 
    }
    .spacer {
       flex: 1 1 auto;
    }
    `,
})
export class ToolbarComponent {

    title = input.required<string>();

    constructor() { }
}
