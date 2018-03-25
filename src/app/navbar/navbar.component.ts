import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { BulkImportService } from 'app/utils/bulk-import.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public authorised = false;

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private bis: BulkImportService ) {

    this.afAuth.authState.subscribe((user: firebase.User) => {
      this.authorised = (user !== null);
    });
  }

  ngOnInit() {
  }

  logout() {
    this.afAuth.auth.signOut();
    // navigate away from protected pages
    if (this.router.url.includes('admin') ) {
       this.router.navigate(['/']);
    }

  }

  importResults() {
    console.log('Starting Import');
    this.bis.loadEvents();
    console.log('Ended Import');

  }

}
