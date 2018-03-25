import { Observable } from 'rxjs/Rx';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { MessageDialogComponent } from "app/dialogs/message-dialog.component";

@Injectable()
export class DialogsService {

    constructor(private dialog: MatDialog) { }

    public confirm(title: string, message: string): Promise<boolean> {

        let dialogRef: MatDialogRef<ConfirmDialogComponent>;

        dialogRef = this.dialog.open(ConfirmDialogComponent);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed().toPromise();
    }

    public message(title: string, message: string): Promise<boolean> {

        let dialogRef: MatDialogRef<MessageDialogComponent>;

        dialogRef = this.dialog.open(MessageDialogComponent);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed().toPromise();
    }
}
