import { MatDialog as MatDialog, MatDialogRef as MatDialogRef } from '@angular/material/dialog';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MessageDialogComponent } from "./message-dialog.component";
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DialogsService {
    private dialog = inject(MatDialog);

    public async confirm(title: string, message: string): Promise<boolean> {

        let dialogRef: MatDialogRef<ConfirmDialogComponent>;

        dialogRef = this.dialog.open(ConfirmDialogComponent);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed().toPromise();
    }

    public async message(title: string, message: string): Promise<boolean> {

        let dialogRef: MatDialogRef<MessageDialogComponent>;

        dialogRef = this.dialog.open(MessageDialogComponent);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed().toPromise();
    }
}
