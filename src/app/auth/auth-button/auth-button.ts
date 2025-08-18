/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, RouterLink],
  templateUrl: './auth-button.html',
})
export class AuthButton {

  protected authService = inject(AuthService);
  private router = inject(Router);

  async logout() {
    await this.authService.signOut();
    await this.router.navigateByUrl('auth/login');
  }
}
