import { Component, inject } from '@angular/core';
import { Auth, User, authState } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, RouterLink],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.scss'
})
export class AuthButtonComponent {
      private auth = inject(Auth);
      private router = inject(Router);
  authorised = false;
  user: User | null = null;

  constructor() {
    authState(this.auth)
      .pipe(untilDestroyed(this))
      .subscribe((u) => {
        this.authorised = (u !== null);
        this.user = u;
      });
  }

  async logout() {
    await this.auth.signOut();
    await this.router.navigateByUrl('auth/login');
  }
}
