import { Component, OnInit, Input } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { Router } from "@angular/router";
import * as firebase from "firebase/app";
import { Results } from "app/results/model";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {

  @Input()
  results: Results;

  public authorised = false;

  constructor(private afAuth: AngularFireAuth,
              private router: Router ) {

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
}
