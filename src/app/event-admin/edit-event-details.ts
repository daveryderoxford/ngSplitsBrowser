import { Component, computed, inject, input, viewChild } from "@angular/core";
import { Router } from '@angular/router';
import { OEvent } from 'app/events/model/oevent';
import { ToolbarComponent } from 'app/shared/components/toolbar.component';
import { EventAdminService } from './event-admin.service';
import { EventDetailsForm } from './event-details-form/event-form';

@Component({
   selector: "app-edit-event-details",
   template: `
         <app-toolbar title="Edit Event Details"/>
         <app-event-form [oevent]="event()" (submitted)="save($event)"/>
       `,
   imports: [ToolbarComponent, EventDetailsForm]
})

export class EditEventDetails {
   ea = inject(EventAdminService);
   router = inject(Router);

   eventId = input.required<string>(); // Route parametyer
   event = computed(() => this.ea.events().find(e => e.key === this.eventId()));

   readonly EditForm = viewChild.required(EventDetailsForm);

   async save(event: Partial<OEvent>) {
      await this.ea.update(this.eventId(), event);
      this.router.navigate(["/admin"]);
   }

   canDeactivate(): boolean {
      return this.EditForm().canDeactivate();
   }
}
