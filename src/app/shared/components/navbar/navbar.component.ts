import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { Results } from "../../../results/model";
import * as firebase from "firebase";
import {BulkImportService} from "scripts/bulk-import";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {

  @Input()
  results: Results;

  public authorised = false;

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
