import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'app/shared/services/sidenav.service';

@Component({
  selector: 'app-sidenav-button',
  template: `
  <a mat-icon-button class="menu" (click)='openSidenav()'>
    <mat-icon class= "material-icons md-26"> menu </mat-icon>
  </a>
    `
})
export class SidenavButtonComponent implements OnInit {

  constructor( public sidenavService: SidenavService) { }

  ngOnInit() {
  }

  openSidenav() {
    this.sidenavService.open();
  }
}
