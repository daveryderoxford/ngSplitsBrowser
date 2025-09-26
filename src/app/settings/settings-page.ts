import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { Settings } from './settings';
import { Toolbar } from "app/shared/components/toolbar";

import { SettingsService } from './settings.service';
@Component({
   selector: 'app-settings-page',
   imports: [MatFormFieldModule, MatSliderModule, MatInputModule, FormsModule, Toolbar],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
   <app-toolbar title="Settings" />
    <div class="settings">
      <mat-form-field>
        <mat-label>Statistics chart size</mat-label>
        <input matInput type="number" [ngModel]="settings().statsChartSize" (ngModelChange)="updateSetting('statsChartSize', $event)">
      </mat-form-field>
      <div>
        <mat-label>Graph Label Text Size ({{ settings().graphLabelTextSize }}px)</mat-label>
        <mat-slider min="8" max="24" step="1" discrete showTickMarks>
          <input  matSliderThumb [ngModel]="settings().graphLabelTextSize" (ngModelChange)="updateSetting('graphLabelTextSize', $event)">
        </mat-slider>
      </div>
    </div>
    `,
   styles: `
   @use "mixins" as mix;

   @include mix.form-page(".settings", 350px);
   `
})
export class SettingsPage {
   private settingsService = inject(SettingsService);
   settings = this.settingsService.settings;

   updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
      this.settingsService.updateSetting(key, value);
   }
}