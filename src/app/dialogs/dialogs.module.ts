import { DialogsService } from './dialogs.service';
import { MatDialogModule, MatButtonModule} from '@angular/material';
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
    ],
    declarations: [
        ConfirmDialogComponent,
        MessageDialogComponent,
    ],
    providers: [
        DialogsService,
    ],
    entryComponents: [
        ConfirmDialogComponent,
    ],
})
export class DialogsModule { }
