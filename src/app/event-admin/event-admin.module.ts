/** Lazy loaded routing module for event administration components */
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventAdminComponent } from "./event-admin/event-admin.component";
import { EventEditComponent } from "./event-edit/event-edit.component";
import { FileButtonComponent } from "./file-button/file-button.component";

export const routes: Routes = [
  {
    path: "",
  ///  canActivate: [AuthGuard],
    children: [
      { path: "", component: EventAdminComponent },
      { path: "event-admin", component: EventAdminComponent },
    ]
  },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        EventEditComponent,
        FileButtonComponent,
        EventAdminComponent,
    ],
    exports: [
        EventAdminComponent,
    ]
})
export class EventAdminModule { }
