import { Component, OnInit, inject } from '@angular/core';
import { SidenavService } from 'app/shared/services/sidenav.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-sidenav-button',
    template: `
  <a mat-icon-button class="menu" (click)='openSidenav()'>
    <mat-icon class= "material-icons md-26"> menu </mat-icon>
  </a>
    `,
    standalone: true,
    imports: [MatButtonModule, MatIconModule]
})
export class SidenavButtonComponent implements OnInit {
      public sidenavService = inject(SidenavService);

  ngOnInit() {
  }

  openSidenav() {
    this.sidenavService.open();
  }
}
