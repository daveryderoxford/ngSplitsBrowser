import { DialogsService } from './dialogs.service';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
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
