import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-about-item',
  template: `
  <mat-expansion-panel>
    <mat-expansion-panel-header>
      <mat-panel-title>
        {{title}}
      </mat-panel-title>
    </mat-expansion-panel-header>
    <ng-content></ng-content>
  </mat-expansion-panel>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutItemComponent implements OnInit {

  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

}
