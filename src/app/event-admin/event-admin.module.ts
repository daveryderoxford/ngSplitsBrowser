/** Lazy loaded routing module for event administration components */
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireStorageModule } from "angularfire2/storage";
import { ChangePasswordComponent } from "app/auth/change-password/change-password.component";
import { AuthGuard } from "app/auth/guards/auth-guard";
import { SharedModule } from "app/shared/shared.module";
import "firebase/storage"; // only import firebase storage
import { EventAdminComponent } from "./event-admin/event-admin.component";
import { EventEditComponent } from "./event-edit/event-edit.component";
import { FileButtonComponent } from "./file-button/file-button.component";

export const routes: Routes = [
  {
    path: "admin",
    canActivate: [AuthGuard],
    children: [
      { path: "", component: EventAdminComponent },
      { path: "event-admin", component: EventAdminComponent }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    SharedModule,
  ],
  declarations: [
    EventEditComponent,
    FileButtonComponent,
    EventAdminComponent,
  ],
  exports: [
    EventEditComponent,
    FileButtonComponent,
    EventAdminComponent,
  ]
})
export class EventAdminModule { }
