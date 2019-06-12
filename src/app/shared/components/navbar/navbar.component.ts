import { Component, Input, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import * as firebase from "firebase/app";
import { BulkImportService } from "scripts/bulk-import";

export type NavBarLayout = "top" | "sidebar" | "menu";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {

  @Input() layout: NavBarLayout = "top";

  authorised = false;

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private bs: BulkImportService) {

    this.afAuth.authState.subscribe((user: firebase.User) => {
      this.authorised = (user !== null);
    });
  }

  ngOnInit() {
  }

  logout() {
    this.afAuth.auth.signOut();
    // navigate away from protected pages
    if (this.router.url.includes("admin") ) {
       this.router.navigate(["/"]);
    }
  }

  async scriptsClicked() {
    await this.bs.loadEvents();
  }
}
