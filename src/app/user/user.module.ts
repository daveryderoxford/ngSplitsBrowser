import { NgModule } from '@angular/core';
import { ResultsFoundDialogComponent } from './results-found-dialog/results-found-dialog.component';
import { UserComponent } from "./user.component";
import { UserRoutingModule } from './user-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule( {
    imports: [
        UserRoutingModule,
        ReactiveFormsModule,
        ResultsFoundDialogComponent,
        UserComponent
    ],
    exports: [
        ResultsFoundDialogComponent,
        UserComponent
    ]
} )
export class UserModule { }
