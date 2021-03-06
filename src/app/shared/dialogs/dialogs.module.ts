import { DialogsService } from './dialogs.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MessageDialogComponent } from './message-dialog.component';

@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
    ],
    exports: [
        ConfirmDialogComponent,
        MessageDialogComponent,
    ],
    declarations: [
        ConfirmDialogComponent,
        MessageDialogComponent,
    ],
    entryComponents: [
        ConfirmDialogComponent,
        MessageDialogComponent,
    ],
})
export class DialogsModule { }
