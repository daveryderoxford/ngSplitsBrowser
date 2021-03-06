import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsFoundDialogComponent } from './results-found-dialog/results-found-dialog.component';
import { UserComponent } from "./user.component";

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule( {
  declarations: [
    ResultsFoundDialogComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    ResultsFoundDialogComponent,
    UserComponent
  ],
} )
export class UserModule { }
