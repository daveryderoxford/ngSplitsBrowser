/** Lazy loaded routing module for event administration components */
import { Routes } from "@angular/router";
import { PendingChangesGuard } from 'app/shared/services/pending-changes-guard-service.guard';
import { AddEvent } from './add-event/add-event';
import { EditEventDetails } from './edit-event-details';
import { EventAdminComponent } from "./event-admin/event-admin";

export const EVENT_ADMIN_ROUTES: Routes = [
  { path: "", component: EventAdminComponent },
  { path: "event-admin", component: EventAdminComponent },
  { path: "add-event", component: AddEvent, canDeactivate: [PendingChangesGuard] },
  { path: "edit-event/:eventId", component: EditEventDetails, canDeactivate: [PendingChangesGuard] },
];
