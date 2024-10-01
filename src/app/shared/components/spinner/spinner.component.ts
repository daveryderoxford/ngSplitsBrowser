import { Component, OnInit, Input} from '@angular/core';
import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';


@Component({
    selector: 'app-spinner',
    template: `
     @if (loading) {
       <div class="loading-spinner">
         <mat-spinner mode="indeterminate" color="accent" diameter="40" ></mat-spinner>
       </div>
     }
     `,
    styleUrls: ['./spinner.component.scss'],
    standalone: true,
    imports: [MatLegacyProgressSpinnerModule]
})
export class SpinnerComponent {

  @Input()
  loading = false;

  constructor() { }

}
