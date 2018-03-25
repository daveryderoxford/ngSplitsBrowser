import { MatDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
    selector: 'app-message-dialog',
    template: `
        <p>{{ title }}</p>
        <p>{{ message }}</p>
        <button type="button" mat-raised-button
            (click)="dialogRef.close(true)">OK</button>`,
})

export class MessageDialogComponent {
    public title: string;
    public message: string;

    constructor(public dialogRef: MatDialogRef<MessageDialogComponent>) {

    }
}

