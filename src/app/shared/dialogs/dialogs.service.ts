/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { MatDialog as MatDialog, MatDialogRef as MatDialogRef } from '@angular/material/dialog';

import { ConfirmDialog } from './confirm-dialog';
import { MessageDialog } from "./message-dialog";
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

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

        return lastValueFrom(dialogRef.afterClosed());
    }

    public async message(title: string, message: string): Promise<boolean> {

        let dialogRef: MatDialogRef<MessageDialog>;

        dialogRef = this.dialog.open(MessageDialog);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed().toPromise();
    }
}
