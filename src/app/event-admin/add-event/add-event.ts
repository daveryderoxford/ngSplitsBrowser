import { Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OEvent } from 'app/events/model/oevent';
import { DialogsService } from 'app/shared';
import { ToolbarComponent } from 'app/shared/components/toolbar.component';
import { EventAdminService } from '../event-admin.service';
import { FileButton } from '../file-button/file-button';
import { EventDetailsForm } from '../event-details-form/event-form';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

type Steps = 'details' | 'upload';

@Component({
    selector: 'app-add-event',
    templateUrl: 'add-event.html',
    styleUrl: 'add-event.scss',
    imports: [EventDetailsForm, FileButton, ToolbarComponent, EventDetailsForm, MatStepperModule, MatButtonModule]
})
export class AddEvent {
   router = inject(Router);
   eventService = inject(EventAdminService);
   dialogsService = inject(DialogsService);

   oevent = signal<OEvent | null>(null);

   eventForm = viewChild(EventDetailsForm);
   stepper = viewChild(MatStepper);
   stepsCompleted = signal(0);

   loading = signal(false);

   async saveEventDetails(details: Partial<OEvent>) {
      try {
        const evt = await this.eventService.add(details);
        this.oevent.set(evt);
         this.stepsCompleted.set(1);
         this.stepper().next()
      } catch (e: any) {
         console.log('Error encountered saving event details' + e.toSting());
         //TODO add a message here
      }
   }

   async uploadSplits(files: File[]) {
      this.loading.set(true);
      try {
         const results = await this.eventService.uploadResults(this.oevent(), files[0]);
         if (results.warnings && results.warnings.length > 0) {
            const msg = results.warnings.reduce((acc = '', warn) => acc + '\n' + warn);
            await this.dialogsService.message("Warnings uploading splits",
               "Splits uploaded sucessfully with the following warning messages\n" + msg);
         } else {
            this.router.navigate(['events']);
         }
      } catch (err) {
         console.log("EventAdminComponnet: Error uploading splits" + err);
         this.dialogsService.message("Error uploading splits", "Error uploading splits\n" + err);
      } finally {
         this.stepsCompleted.set(2);
         this.loading.set(false);
      }
   }

   done() {
      this.router.navigate(['admin']);
   }

   canDeactivate(): boolean {
      return this.eventForm()!.canDeactivate();
   }
}