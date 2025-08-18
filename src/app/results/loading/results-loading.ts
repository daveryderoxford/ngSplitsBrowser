/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ResultsLoadingContainer } from './loading-container';

@Component({
   selector: 'app-results-loading',
   standalone: true,
   imports: [
      ResultsLoadingContainer,
      MatProgressSpinnerModule,
      MatButtonModule,
      MatIconModule
   ],
   template: `
   <app-results-loading-container>
      <mat-spinner diameter = "50" > </mat-spinner>
      <p> Loading results...</p>
      <button matButton = "tonal" (click) = "navigateToEvents()" >
         <mat-icon> arrow_back </mat-icon>
         Back to Events
      </button>
   </app-results-loading-container>
  `,
   styles: `
   p {
      margin-top: 16px;
      font-size: 1.1em;
      color: #333;
    }

    button {
      margin-top: 24px;
    }`,
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsLoading {
   private router = inject(Router);

   navigateToEvents(): void {
      this.router.navigate(['/events']);
   }
}
