import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'app/shared/services/sidenav.service';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';

@Component({
    selector: 'app-sidenav-button',
    template: `
  <a mat-icon-button class="menu" (click)='openSidenav()'>
    <mat-icon class= "material-icons md-26"> menu </mat-icon>
  </a>
    `,
    standalone: true,
    imports: [MatLegacyButtonModule, MatIconModule]
})
export class SidenavButtonComponent implements OnInit {

  constructor( public sidenavService: SidenavService) { }

  ngOnInit() {
  }

  openSidenav() {
    this.sidenavService.open();
  }
}
