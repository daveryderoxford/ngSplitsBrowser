/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { MatDialogRef as MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-confirm-dialog',
    template: `
        <h3 mat-dialog-title>{{ title }}</h3>
        <p mat-dialog-content> {{ message }} </p>
        <mat-divider  />
        <div mat-dialog-actions>
            <button type="button" mat-raised-button (click)="dialogRef.close(true)">OK</button>
            <button type="button" mat-button (click)="dialogRef.close(false)">Cancel</button>
        </div>
    `,
    imports: [MatDialogModule, MatDividerModule, MatButtonModule]
})
export class ConfirmDialog {
    dialogRef = inject<MatDialogRef<ConfirmDialog>>(MatDialogRef);

    public title: string = '';
    public message: string = '';
}
