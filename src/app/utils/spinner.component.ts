import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
    <div *ngIf="loading" class="loading-spinner">
      <mat-progress-spinner mode="indeterminate" color="accent"></mat-progress-spinner>
    </div>
  `,
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  @Input()
  loading = false;

  constructor() { }

  ngOnInit() {
  }

}
