// @ts-nocheck

import { Component, computed, model } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StatsVisibilityFlags } from './splitsbrowser/chart';

@Component({
    selector: 'app-label-flags-select',
    imports: [MatSelectModule, MatFormFieldModule],
    template: `
   <mat-form-field appearance="outline" subscriptSizing="dynamic" class="dense-form-field">
      <mat-label>Display</mat-label>
      <mat-select #select [value]="this.selected()" multiple>
             <mat-select-trigger>
               <span class=small-text>{{makeSelectText(select.value)}}</span>
    </mat-select-trigger>

         @for (option of options; track option) {
            <mat-option [value]="option.key" (click)="toggleOption(option)" >{{ option.label }}</mat-option>
         }
      </mat-select>
  </mat-form-field>
  `,
    styles: ` 
    .small-text {
      font-size: 0.8em;
    }
   `
})
export class LabelFlagSelect {

   flags = model.required<StatsVisibilityFlags>();

   selected = computed(() => Object.keys(this.flags()).filter((key) => this.flags()[key]));

   options = [
      { key: "totalTime", label: "Total Time", shortlabel: "Total" },
      { key: "splitTime", label: "Split Time", shortlabel: "Split" },
      { key: "behindFastest", label: "Behind Fastest", shortlabel: "Behind" },
      { key: "timeLoss", label: "Time Loss", shortlabel: "Loss" }
   ];

   toggleOption(option: any) {
      const o = this.flags();
      o[option.key] = !o[option.key];
      this.flags.set(o);
   }

   makeSelectText(keys: string[]): string {
      const labels = keys.map(key => (this.options.find(o => o.key === key)).shortlabel);
      return labels.join(", ");
   }

}