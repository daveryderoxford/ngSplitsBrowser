import { Component, OnInit, Input} from '@angular/core';
import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-spinner',
    template: `
     <div *ngIf="loading" class="loading-spinner">
      <mat-spinner mode="indeterminate" color="accent" diameter="40" ></mat-spinner>
    </div>
  `,
    styleUrls: ['./spinner.component.scss'],
    standalone: true,
    imports: [NgIf, MatLegacyProgressSpinnerModule]
})
export class SpinnerComponent {

  @Input()
  loading = false;

  constructor() { }

}
