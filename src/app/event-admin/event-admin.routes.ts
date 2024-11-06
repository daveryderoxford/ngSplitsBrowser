/** Lazy loaded routing module for event administration components */
import { Routes } from "@angular/router";
import { EventAdminComponent } from "./event-admin/event-admin.component";

export const EVENT_ADMIN_ROUTES: Routes = [
  {
    path: "",
  ///  canActivate: [AuthGuard],
    children: [
      { path: "", component: EventAdminComponent },
      { path: "event-admin", component: EventAdminComponent },
    ]
  },
];

