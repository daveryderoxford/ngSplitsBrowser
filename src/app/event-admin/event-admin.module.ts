/** Lazy loaded routing module for event administration components */
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import "firebase/storage"; // only import firebase storage
import { AuthGuard } from "../auth/guards/auth-guard";
import { SharedModule } from "../shared/shared.module";
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
