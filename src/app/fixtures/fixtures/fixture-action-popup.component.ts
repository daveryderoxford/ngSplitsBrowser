import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Fixture } from 'app/model/fixture';

/** Dialog to perform fixture actions in mobile view */
@Component({
  selector: 'app-fixture-action-popup',
  template: `
     <mat-action-list>
        <a mat-list-item href="{{fixture.clubURL}}"> CLUB WEBSITE</a>
        <a mat-list-item *ngIf="fixture.latLong;" href="{{fixture | bingURL}}" target="_blank">OS MAP</a>
        <a mat-list-item *ngIf="fixture.latLong;" href="{{fixture | googleURL}}" target="_blank">GOOGLE MAP</a>
        <a mat-list-item *ngIf="fixture.latLong;" href="{{fixture | googleDirectionsURL}}" target="_blank">DIRECTIONS</a>
    </mat-action-list>
  `,
  styles: [
    'a:hover, a:visited, a:link, a:active { text-decoration: none; }'
  ]
})
export class FixtureActionPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FixtureActionPopupComponent>,
             @Inject(MAT_DIALOG_DATA) public fixture: Fixture ) { }

  ngOnInit() {
  }
}
