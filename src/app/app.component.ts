import { Component, OnInit, viewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from "@angular/router";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SidenavService } from './shared/services/sidenav.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { tap } from 'rxjs/operators';

import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { MatListModule } from '@angular/material/list';
import { Auth, authState, signOut, User } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@UntilDestroy()
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
   imports: [SpinnerComponent, MatSidenavModule, MatListModule, RouterOutlet]
})
export class AppComponent implements OnInit {

   sidenav = viewChild<MatSidenav>(MatSidenav);

   loading = false;
   authorised = false;
   user: User;
   handset = false;

   constructor ( private router: Router,
      private firestore: Firestore,
      private auth: Auth,
      private sidebarService: SidenavService,
      private snackbar: MatSnackBar,
    //  private bs: BulkImportService,
      private snackBar: MatSnackBar,
      private breakpointObserver: BreakpointObserver,
   ) { }

   ngOnInit() {

      this.breakpointObserver.observe( ['(min-width: 500px) and (min-height: 400px)'] )
         .pipe( tap( state => console.log( 'AppComponnet: state: ' + state.matches.toString() ) ) )
         .subscribe( state => this.handset = !state.matches );

      authState(this.auth)
         .pipe(untilDestroyed(this))
         .subscribe((user) => {
         this.authorised = ( user !== null );
         this.user = user;
      } );

      this.sidebarService.setSidenav( this.sidenav() );
      this.cookieConsent();
   }

   private cookieConsent() {
      const ConsentCookie = "CookieConsent";

      if ( !this.readCookie( ConsentCookie ) ) {
         this.snackbar.open( "This site uses cookies for analytics purposes.", "Accept" ).afterDismissed().subscribe( () => {
            document.cookie = ConsentCookie + "=true";
         } );
      }
   }

   private readCookie( name: string ) {
      const nameEQ = name + "=";
      const ca = document.cookie.split( ';' );

      for ( const c of ca ) {
         if ( c.trim().indexOf( nameEQ ) === 0 ) {
            return c.substring( nameEQ.length, c.length );
         }
      }
      return null;
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

   async closeSidenav( target: Array<any>) {
      await this.sidenav().close();
      if ( target)  {
         await this.router.navigate( target );
      }
   }

   async contact() {
      await this.sidenav().close();
      window.location.href = "mailto:support@splitsbrowser.org.uk";
   }

   async logout() {
      // navigate away from protected pages
      if ( this.router.url.includes( "admin" ) ) {
         await this.router.navigate( ["/"] );
      }

      await signOut(this.auth);
      await this.sidenav().close();
   }


   // Administration functions

   isAdmin(): boolean {
      return false;

      // TODO make this work
      /*  try {
           if (!this.user) {
              return false;
           }
           const idTokenResult = await this.user.getIdTokenResult( true );
           return idTokenResult.claims.admin;
        } catch ( err ) {
           console.log( "AppComponent: Error obtaining custom claim " + err );
           return false;
        } */
   }

   // Detects if device is on iOS
   isIos(): boolean {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test( userAgent );
   }

   isInStandaloneMode(): boolean {
      const nav: any = window.navigator;
      return ( 'standalone' in nav ) && nav.standalone;

   }

   async showIosInstallBanner() {

      const isBannerShown = localStorage.getItem( 'isBannerShown' );

      // Checks if it should display install popup notification
      if ( this.isIos() && !this.isInStandaloneMode() && isBannerShown === undefined ) {
         const snackBarRef = this.snackBar.open( `To install the app, tap "Share" icon below and select "Add to Home Screen".` );

         snackBarRef.afterDismissed().subscribe( () => {
            localStorage.setItem( 'isBannerShown', 'true' );
         } );

      }
   }

   async scriptsClicked() {
     // await this.bs.loadEvents();
      await this.sidenav().close();

   }
}

