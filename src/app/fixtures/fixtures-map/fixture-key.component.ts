import { Component, OnInit } from '@angular/core';

/** button for fixture key */
@Component({
  selector: 'app-fixture-key',
  template: `
  <button class="button" [matMenuTriggerFor]="key">Key</button>
   <mat-menu #key="matMenu" yPosition="above">
      <ul>
        <li>Coffee</li>
        <li>Tea</li>
        <li>Milk</li>
      </ul>
   </mat-menu>
  `,
  styles: [
    ' .button { background-color: transparent; border: none; outline: none; font-size: 16px; }',
    ' .button: focus { border: none;}',
    ' .button: hover { background-color: rgb(255,255,255, 0.5); }'
  ]
})
export class FixtureKeyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


