import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatLineModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { UserResult } from 'app/model';

@Component({
    selector: 'app-results-found-dialog',
    templateUrl: './results-found-dialog.component.html',
    styleUrls: ['./results-found-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogModule, MatListModule, MatLineModule, MatButtonModule, DatePipe]
})
export class ResultsFoundDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ResultsFoundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserResult[]) { }

}
