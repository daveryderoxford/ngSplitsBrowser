import { DialogsService } from './dialogs.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MessageDialogComponent } from './message-dialog.component';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatDividerModule,
    ],
    exports: [
        ConfirmDialogComponent,
        MessageDialogComponent,
    ],
    declarations: [
        ConfirmDialogComponent,
        MessageDialogComponent,
    ]
})
export class DialogsModule { }
