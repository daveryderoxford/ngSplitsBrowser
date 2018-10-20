import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserResult } from 'app/model';

@Component({
  selector: 'app-results-found-dialog',
  templateUrl: './results-found-dialog.component.html',
  styleUrls: ['./results-found-dialog.component.scss']
})
export class ResultsFoundDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ResultsFoundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserResult[]) { }

}
