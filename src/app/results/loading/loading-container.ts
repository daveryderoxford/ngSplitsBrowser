import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Toolbar } from 'app/shared/components/toolbar';

@Component({
  selector: 'app-results-loading-container',
  standalone: true,
  imports: [
    Toolbar
  ],
  template: `
    <app-toolbar title=""/>
    <div class="loading-container">
      <div class="loading-box">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: `
    :host {
      height: 100%;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      background-color: var(--primary-background-color);
      z-index: 1000; /* Ensure it's on top of other content */
    }

    .loading-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      background-color: white;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsLoadingContainer {}
