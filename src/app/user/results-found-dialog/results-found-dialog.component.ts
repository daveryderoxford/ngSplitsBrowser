import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { UserResult } from 'app/model';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLineModule } from '@angular/material/core';
import { NgFor, DatePipe } from '@angular/common';
import { MatLegacyListModule } from '@angular/material/legacy-list';

@Component({
    selector: 'app-results-found-dialog',
    templateUrl: './results-found-dialog.component.html',
    styleUrls: ['./results-found-dialog.component.scss'],
    standalone: true,
    imports: [MatLegacyDialogModule, MatLegacyListModule, NgFor, MatLineModule, MatLegacyButtonModule, DatePipe]
})
export class ResultsFoundDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ResultsFoundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserResult[]) { }

}
