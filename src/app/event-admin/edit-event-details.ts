import { ChangeDetectionStrategy, Component, computed, inject, input, signal, viewChild } from "@angular/core";
import { Router } from '@angular/router';
import { OEvent } from 'app/events/model/oevent';
import { Toolbar } from 'app/shared/components/toolbar';
import { EventAdminService } from './event-admin.service';
import { EventDetailsForm } from './event-form/event-form';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
   selector: "app-edit-event-details",
   changeDetection:  ChangeDetectionStrategy.OnPush,
   template: `
         <app-toolbar title="Edit Event Details"/>
         <app-event-form [oevent]="event()" (submitted)="save($event)"/>
       `,
   imports: [Toolbar, EventDetailsForm],
   styles: `
      @use "mixins" as mix;
      @include mix.form-page("app-event-form", 400px);
   `
})

export class EditEventDetails {
   ea = inject(EventAdminService);
   router = inject(Router);
   public snackBar = inject(MatSnackBar);

   eventId = input.required<string>(); // Route parametyer
   event = computed(() => this.ea.events().find(e => e.key === this.eventId()));

   busy = signal(false);

   readonly editForm = viewChild.required(EventDetailsForm);

   async save(event: Partial<OEvent>) {
      this.busy.set(true)
      try {
         await this.ea.update(this.eventId(), event);
         this.editForm().reset();
         this.router.navigate(["/admin"]);
      } catch (e) {
         console.error('EditEventDetails: Error saving event', e);
         this.snackBar.open("Error saving event details", "Dismiss");
      } finally {
         this.busy.set(false);
      }
   }

   canDeactivate(): boolean {
      return this.editForm().canDeactivate();
   }
}
