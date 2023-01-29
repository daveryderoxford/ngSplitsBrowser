/** Node script to build the index of club */
import {Inject, NgModule} from "@angular/core";

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { LogEntry } from "app/model/log-entry";
import { Club, EventGrades, EventSummary, OEvent, SplitsFileInfo } from "app/model";
import { EventAdminService } from "app/event-admin/event-admin.service";
import { Utils } from "app/shared";

/*Declare golbal providers for services we use.
* This will allow angular injector to create instances of child componnets as required
*/

@NgModule( {
    imports: [AngularFireModule],
    providers: [EventAdminService, AngularFireDatabase]
})

/**
 * @Inject uses angular injection system to inject an instance of eventAdmin into the function.
 */
function buildClub( @Inject(EventAdminService) eventAdmin) {



}
