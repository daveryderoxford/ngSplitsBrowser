
/** Imports shared between the home page and the upload page  */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogsModule } from 'app/dialogs/dialogs.module';

import {
    MdCoreModule, MdRippleModule, MdButtonModule, MdCardModule, MdIconModule,
    MdMenuModule, MdToolbarModule, MdTooltipModule
} from '@angular/material';

import { NavbarComponent } from 'app/navbar/navbar.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MdCoreModule,
        MdRippleModule,
        MdButtonModule,
        MdCardModule,
        MdIconModule,
        MdMenuModule,
        MdToolbarModule,
        MdTooltipModule,
        RouterModule,
        FlexLayoutModule,
        DialogsModule,
    ],
    declarations: [NavbarComponent],
    exports: [NavbarComponent],
    providers: [AngularFireAuth, AngularFireDatabase]
})
export class SharedModule { }
