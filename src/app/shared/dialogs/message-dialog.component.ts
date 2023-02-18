import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';

@Component({
    selector: 'app-message-dialog',
    template: `
        <h3 mat-dialog-title>{{ title }}</h3>
        <p mat-dialog-content>{{ message }}</p>
        <mat-divider></mat-divider>
        <div mat-dialog-actions>
        <button type="button" mat-raised-button
            (click)="dialogRef.close(true)">OK</button>
        </div>
    `,   
})

export class MessageDialogComponent {
    public title: string;
    public message: string;

    constructor(public dialogRef: MatDialogRef<MessageDialogComponent>) {

    }
}

