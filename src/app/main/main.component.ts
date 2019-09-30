import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OEvent } from "../model/oevent";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {

  events: Observable<OEvent[]>;

  constructor( private afs: AngularFirestore,
               private router: Router,
              private snackBar: MatSnackBar) { }

 ngOnInit() {

    this.events = this.afs.collection<OEvent>("/events",
      ref => ref.orderBy("date", "desc").limit(4) ).valueChanges();
  }

  eventClicked(event: OEvent) {
     this.router.navigate(["/graph", event.key ]);
  }

  async showIosInstallBanner() {
    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test( userAgent );
    };
    // Detects if device is in standalone mode
    const nav: any = window.navigator;
    const isInStandaloneMode = () => ( 'standalone' in nav ) && nav.standalone;

    // Show the banner once
    localStorage.setItem( 'whatever', 'something' );

    const isBannerShown = localStorage.getItem( 'isBannerShown');

    // Checks if it should display install popup notification
    if ( isIos() && !isInStandaloneMode() && isBannerShown === undefined ) {
      const snackBarRef = this.snackBar.open(  `To install the app, tap "Share" icon below and select "Add to Home Screen".` );

      snackBarRef.afterDismissed().subscribe( () => {
        localStorage.setItem( 'isBannerShown', 'true' );
      } );

    }
  }


}
