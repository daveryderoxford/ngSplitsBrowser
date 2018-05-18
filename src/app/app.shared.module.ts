
/** Imports shared between the home page and the upload page  */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DialogsModule } from "app/dialogs/dialogs.module";

import {
    MatRippleModule, MatButtonModule, MatCardModule, MatIconModule,
    MatMenuModule, MatToolbarModule, MatTooltipModule
} from "@angular/material";

import { NavbarComponent } from "app/navbar/navbar.component";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { SpinnerComponent } from './utils/spinner.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatRippleModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatTooltipModule,
        RouterModule,
        FlexLayoutModule,
        DialogsModule,
    ],
    declarations: [NavbarComponent, SpinnerComponent],
    exports: [NavbarComponent],
    providers: [AngularFireAuth, AngularFireDatabase]
})
export class SharedModule { }
