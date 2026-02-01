import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../auth/auth.service';
import { SelectedEventService } from 'app/events/selected-event.service';
import { UserResultButton } from "app/user-results/user-result-button";
import { UrlDialogComponent } from 'app/shared/dialogs/url-dialog/url-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sidenav-menu',
  imports: [
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule,
    UserResultButton
],
  templateUrl: './sidenav-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavMenu {
  private router = inject(Router);
  private sidenav = inject(MatSidenav);
  protected auth = inject(AuthService);
  protected ses = inject(SelectedEventService);
  private dialog = inject(MatDialog);

  async closeSidenav(url?: string[]) {
    if (url) {
      await this.router.navigate(url);
    }
    await this.sidenav.close();
  }

  async navigateToEvent() {
    await this.sidenav.close();
    await this.ses.navigateToEvent(this.ses.selectedEvent());
  }

  async loadFromUrl(): Promise<void> {
    await this.sidenav.close();
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
    await this.sidenav.close();
  }

  async contact() {
    await this.sidenav.close();
    window.location.href = "mailto:support@splitsbrowser.org.uk";
  }
}
