import { DialogsService } from './dialogs.service';
import { MdDialogModule, MdButtonModule} from '@angular/material';
import { NgModule } from '@angular/core';

import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
    imports: [
        MdDialogModule,
        MdButtonModule,
    ],
    exports: [
        ConfirmDialogComponent,
    ],
    declarations: [
        ConfirmDialogComponent,
    ],
    providers: [
        DialogsService,
    ],
    entryComponents: [
        ConfirmDialogComponent,
    ],
})
export class DialogsModule { }
