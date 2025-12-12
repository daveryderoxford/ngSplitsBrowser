import { ChangeDetectionStrategy, Component, inject, OnInit, viewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from './auth/auth.service';
import { SidenavService } from './shared/services/sidenav.service';
import { UserResultButton } from "./user-results/user-result-button";
import { SelectedEventService } from './events/selected-event.service';
import { UrlDialogComponent } from './shared/dialogs/url-dialog/url-dialog.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['app.component.scss'],
    imports: [MatSidenavModule, MatListModule, RouterOutlet, UserResultButton, MatDialogModule],
    changeDetection:  ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
   auth = inject(AuthService);
   ses = inject(SelectedEventService);
   sidebarService = inject(SidenavService);
   snackbar = inject(MatSnackBar);
   router = inject(Router);
   dialog = inject(MatDialog);

   sidenav = viewChild.required(MatSidenav);

   ngOnInit() {
      this.sidebarService.setSidenav(this.sidenav());
      this.cookieConsent();
   }

   async loadFromUrl(): Promise<void> {
      await this.sidenav().close();
      const dialogRef = this.dialog.open(UrlDialogComponent);
  
      dialogRef.afterClosed().subscribe(async (url: string) => {
        if (url) {
          await this.router.navigate(['/results', 'graph', 'online'], {
            queryParams: { url: url },
          });
        }
      });
    }

   async logout() {
      // navigate away from protected pages
      if (this.router.url.includes("admin")) {
         await this.router.navigate(["/"]);
      }

      await this.auth.signOut();
      await this.sidenav().close();
   }

   private cookieConsent() {
      const ConsentCookie = "CookieConsent";

      if (!this.readCookie(ConsentCookie)) {
         this.snackbar.open("This site uses cookies for analytics purposes.", "Accept").afterDismissed().subscribe(() => {
            document.cookie = ConsentCookie + "=true";
         });
      }
   }

   private readCookie(name: string) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');

      for (const c of ca) {
         if (c.trim().indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
         }
      }
      return null;
   }

   async closeSidenav(target: any[]) {
      await this.sidenav().close();
      if (target) {
         await this.router.navigate(target);
      }
   }

   async navigateToEvent() {
      await this.sidenav().close();
      await this.ses.navigateToEvent(this.ses.selectedEvent());
   }

   async contact() {
      await this.sidenav().close();
      window.location.href = "mailto:support@splitsbrowser.org.uk";
   }
}
