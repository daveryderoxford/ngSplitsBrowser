/** Lazy loaded routing module for event administration components */
import { Routes } from "@angular/router";
import { EventAdminComponent } from "./event-admin/event-admin.component";
import { AuthGuard } from 'app/auth/guards/auth-guard';
import { AddEvent } from './event-edit/add-event/add-event';
import { PendingChangesGuard } from 'app/shared/services/pending-changes-guard-service.guard';

export const EVENT_ADMIN_ROUTES: Routes = [
  { path: "", component: EventAdminComponent },
  { path: "event-admin", component: EventAdminComponent },
  { path: "add-event", component: AddEvent, canDeactivate: [PendingChangesGuard] },
  { path: "edit-event/:key", component: AddEvent, canDeactivate: [PendingChangesGuard] },
];
