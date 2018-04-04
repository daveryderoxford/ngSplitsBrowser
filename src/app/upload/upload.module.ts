import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { UploadMaterialModule } from "app/upload/upload-material.module";
import { FileButtonComponent } from "./file-button/file-button.component";

import { AngularFireModule } from "angularfire2";
import "firebase/storage"; // only import firebase storage


import { AuthGuard } from "../auth/guards/auth-guard";
import { EventAdminComponent } from "./event-admin/event-admin.component";
import { EventAdminService } from "app/upload/event-admin.service";
import { EventEditComponent } from "./event-edit/event-edit.component";

import { SharedModule } from "app/app.shared.module";

export const routes: Routes = [
  {
    path: "admin",
    canActivate: [AuthGuard],
    children: [
      { path: "", component: EventAdminComponent },
      { path: "event-admin", component: EventAdminComponent },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    AngularFireModule,
    UploadMaterialModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    SharedModule,
  ],
  providers: [
    EventAdminService,
  ],
  declarations: [
    EventEditComponent,
    FileButtonComponent,
    EventAdminComponent,
  ]
})
export class UploadModule { }
