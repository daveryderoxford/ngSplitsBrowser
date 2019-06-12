import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterEvent, NavigationCancel, NavigationError, NavigationStart, Event } from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  template: `
    <app-spinner [loading]="loading"> </app-spinner>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {

  loading = false;

  constructor(private router: Router,
             private afs: AngularFirestore) {
    // Send google analytics message when navigating to any route succeeds.
    this.router.events.subscribe(event => {
      this.reportAnalytics(event);
      this.setLoading(event);
    });

    this.configureFirebase();
  }

  private setLoading(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }

  private reportAnalytics(event: Event) {
    if (event instanceof NavigationEnd) {
      (<any>window).ga('set', 'page', event.urlAfterRedirects);
      (<any>window).ga('send', 'pageview');
    }
  }

  private configureFirebase() {
    this.afs.firestore.settings( { });
  }
}

