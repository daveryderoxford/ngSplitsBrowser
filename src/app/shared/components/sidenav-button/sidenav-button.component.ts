import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'app/shared/services/sidenav.service';

@Component({
  selector: 'app-sidenav-button',
  templateUrl: './sidenav-button.component.html',
  styleUrls: ['./sidenav-button.component.scss']
})
export class SidenavButtonComponent implements OnInit {

  constructor( public sidenavService: SidenavService) { }

  ngOnInit() {
  }

  openSidenav() {
    this.sidenavService.open();
  }

}
