/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
/** Lazy loaded routing module for event administration components */
import { Routes } from "@angular/router";
import { PendingChangesGuard } from 'app/shared/services/pending-changes-guard-service.guard';
import { AddEvent } from './add-event/add-event';
import { EditEventDetails } from './edit-event-details';
import { EventAdminComponent } from "./event-admin/event-admin-page";

export const EVENT_ADMIN_ROUTES: Routes = [
  { path: "", component: EventAdminComponent },
  { path: "event-admin", component: EventAdminComponent },
  { path: "add-event", component: AddEvent, canDeactivate: [PendingChangesGuard] },
  { path: "edit-event/:eventId", component: EditEventDetails, canDeactivate: [PendingChangesGuard] },
];
