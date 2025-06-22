import { MatDialog as MatDialog, MatDialogRef as MatDialogRef } from '@angular/material/dialog';

import { ConfirmDialog } from './confirm-dialog';
import { MessageDialog } from "./message-dialog";
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DialogsService {
    private dialog = inject(MatDialog);

    public async confirm(title: string, message: string): Promise<boolean> {

        let dialogRef: MatDialogRef<ConfirmDialog>;

        dialogRef = this.dialog.open(ConfirmDialog);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed().toPromise();
    }

    public async message(title: string, message: string): Promise<boolean> {

        let dialogRef: MatDialogRef<MessageDialog>;

        dialogRef = this.dialog.open(MessageDialog);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed().toPromise();
    }
}
