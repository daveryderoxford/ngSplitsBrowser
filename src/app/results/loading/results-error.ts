import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ResultsLoadingContainer } from './loading-container';

@Component({
   selector: 'app-results-error',
   standalone: true,
   imports: [
      ResultsLoadingContainer,
      MatButtonModule,
      MatIconModule
   ],
   template: `
   <app-results-loading-container>
      <span class="message">Error loading results</span>
      <span class="error-message">{{ errorMessage() }}</span>
      <button matButton = "tonal" (click) = "reload()" >
         Reload
      </button>
      <button matButton = "tonal" (click) = "navigateToEvents()" >
         <mat-icon> arrow_back </mat-icon>
         Back to Events
      </button>
   </app-results-loading-container>
  `,
   styles: `
   .message {
      margin-top: 16px;
      font: var(--mat-sys-title-medium);
      color: #333;
    }

    .error-message {
      margin-top: 16px; 
      font: var(--mat-sys-body-medium);
    }

    button {
      margin-top: 24px;
    }`,
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsError {
   private router = inject(Router);

   errorMessage = input<string>("");

   navigateToEvents(): void {
      this.router.navigate(['/events']);
   }

   reload() {
      window.location.reload();
   }
}



