import { AfterViewInit, Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OEvent } from 'app/events/model/oevent';
import { DialogsService } from 'app/shared';
import { Toolbar } from 'app/shared/components/toolbar';
import { EventAdminService } from '../event-admin.service';
import { FileButton } from '../file-button/file-button';
import { EventDetailsForm } from '../event-details-form/event-form';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
   selector: 'app-add-event',
   templateUrl: 'add-event.html',
   styleUrl: 'add-event.scss',
   imports: [EventDetailsForm, FileButton, Toolbar, EventDetailsForm, MatStepperModule, MatButtonModule, MatTooltipModule]
})
export class AddEvent implements AfterViewInit {
   router = inject(Router);
   eventService = inject(EventAdminService);
   dialogsService = inject(DialogsService);

   oevent = signal<OEvent | undefined>(undefined);

   eventForm = viewChild.required(EventDetailsForm);
   stepper = viewChild.required(MatStepper);

   loading = signal(false);

   ngAfterViewInit() {
      // Workaround for [completed] directive not working.
      // Set completed state to false/true in code
      for (const step of this.stepper().steps) {
         step.completed = false;
      }
   }

   async saveEventDetails(details: Partial<OEvent>) {
      try {
         const evt = await this.eventService.add(details);
         this.oevent.set(evt);
         this.stepper().selected.completed = true;
         this.stepper().selected.editable = false;
         this.stepper().next();
      } catch (e: any) {
         console.error(`AddEvent: Error encountered saving event details  ${e.toSting()}`);
         this.dialogsService.message("Error saving event details", "Error saving event details");
      }
   }

   async uploadSplits(files: File[]) {
      this.loading.set(true);
      try {
         const results = await this.eventService.uploadResults(this.oevent(), files[0]);
         if (results.warnings && results.warnings.length > 0) {
            const msg = results.warnings.reduce((acc = '', warn) => acc + '\n' + warn);
            await this.dialogsService.message("Warnings uploading splits",
               "Splits uploaded with the following warning messages\n" + msg);
         }
         this.stepper().selected.completed = true;
         this.stepper().next();
      } catch (err) {
         console.log("EventAdminComponnet: Error uploading splits\n " + err);
         this.dialogsService.message("Error uploading splits", "Error uploading splits\n" + err);
      } finally {
         this.loading.set(false);
      }
   }

   done() {
      this.router.navigate(['admin']);
   }

   canDeactivate(): boolean {
      return this.eventForm()!.canDeactivate();
   }

   copyText(s: string) {
      navigator.clipboard.writeText(s);
   }

}