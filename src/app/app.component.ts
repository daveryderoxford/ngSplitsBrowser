import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSidenav } from '@angular/material/sidenav';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";
import { BulkImportService } from 'scripts/bulk-import';
import { SidenavService } from './shared/services/sidenav.service';

@Component( {
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['app.component.scss']
} )
export class AppComponent implements OnInit {

   @ViewChild( MatSidenav, {static: true} ) sidenav: MatSidenav;

   loading = false;
   authorised = false;

   constructor ( private router: Router,
      private afs: AngularFirestore,
      private afAuth: AngularFireAuth,
      private sidebarService: SidenavService,
      private bs: BulkImportService
   ) {

      // Send google analytics message when navigating to any route succeeds.
      this.router.events.subscribe( event => {
         this.reportAnalytics( event );
         this.setLoading( event );
      } );

      this.configureFirebase();

      this.afAuth.authState.subscribe( ( user: firebase.User ) => {
         this.authorised = ( user !== null );
      } );
   }

   ngOnInit() {
      this.sidebarService.setSidenav( this.sidenav );
   }


   private setLoading( routerEvent: Event ): void {
      if ( routerEvent instanceof NavigationStart ) {
         this.loading = true;
      }

      if ( routerEvent instanceof NavigationEnd ||
         routerEvent instanceof NavigationCancel ||
         routerEvent instanceof NavigationError ) {
         this.loading = false;
      }
   }

   private reportAnalytics( event: Event ) {
      if ( event instanceof NavigationEnd ) {
         ( <any> window ).ga( 'set', 'page', event.urlAfterRedirects );
         ( <any> window ).ga( 'send', 'pageview' );
      }
   }

   private configureFirebase() {
      this.afs.firestore.settings( {} );
   }

   async closeSidenav( target: string ) {
      await this.sidenav.close();
      await this.router.navigate( [ target ] );
   }

   async logout() {
      // navigate away from protected pages
      if ( this.router.url.includes( "admin" ) ) {
         await this.router.navigate( [ "/" ] );
      }
      await this.afAuth.auth.signOut();
      await this.sidenav.close();
   }

   async scriptsClicked() {
      await this.bs.loadEvents();
     await this.sidenav.close();

   }
}

