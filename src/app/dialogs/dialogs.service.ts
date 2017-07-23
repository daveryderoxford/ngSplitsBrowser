import { Observable } from 'rxjs/Rx';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { MessageDialogComponent } from "app/dialogs/message-dialog.component";

@Injectable()
export class DialogsService {

    constructor(private dialog: MdDialog) { }

    public confirm(title: string, message: string): Promise<boolean> {

        let dialogRef: MdDialogRef<ConfirmDialogComponent>;

        dialogRef = this.dialog.open(ConfirmDialogComponent);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed().toPromise();
    }

    public message(title: string, message: string): Promise<boolean> {

        let dialogRef: MdDialogRef<MessageDialogComponent>;

        dialogRef = this.dialog.open(MessageDialogComponent);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed().toPromise();
    }
}
