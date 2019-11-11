import { Component, OnInit, Input } from '@angular/core';

@Component( {
   selector: 'app-toolbar',
   template: `
<mat-toolbar>
   <app-sidenav-button> </app-sidenav-button> <ng-content> </ng-content>
</mat-toolbar>
    `
} )
export class ToolbarComponent implements OnInit {

   @Input() title;

   constructor (  ) { }

   ngOnInit() {
   }


}
