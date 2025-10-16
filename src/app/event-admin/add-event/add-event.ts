import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OEvent } from 'app/events/model/oevent';
import { DialogsService } from 'app/shared';
import { Toolbar } from 'app/shared/components/toolbar';
import { EventAdminService } from '../event-admin.service';
import { FileButton } from '../file-button/file-button';
import { EventDetailsForm } from '../event-form/event-form';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { SelectedEventService } from 'app/events/selected-event.service';

@Component({
   selector: 'app-add-event',
   templateUrl: 'add-event.html',
   styleUrl: 'add-event.scss',
   imports: [
      EventDetailsForm, 
      FileButton, 
      Toolbar, 
      EventDetailsForm, 
      MatStepperModule, 
      MatButtonModule, 
      MatTooltipModule,
      MatIconModule
   ],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEvent implements AfterViewInit {
   router = inject(Router);
   eventService = inject(EventAdminService);
   ses = inject(SelectedEventService);
   dialogsService = inject(DialogsService);

   oevent = signal<OEvent | undefined>(undefined);

   eventForm = viewChild.required(EventDetailsForm);
   stepper = viewChild.required(MatStepper);

   resultsUrl = computed(() => {
      const evt = this.oevent();
      if (evt) {
         return (`https://www.splitsbrowser.org.uk/results/graph/${evt.key}`);
      } else {
         return "";
      }
   });

   busy = signal(false);

   ngAfterViewInit() {
      // Workaround for [completed] directive not working.
      // Set completed state to false/true in code
      for (const step of this.stepper().steps) {
         step.completed = false;
      }
   }

   async saveEventDetails(details: Partial<OEvent>) {
      this.busy.set(true);
      try {
         const evt = await this.eventService.add(details);
         this.eventForm().reset();
         this.oevent.set(evt);
         this.stepper().selected.completed = true;
         this.stepper().selected.editable = false;
         this.stepper().next();
      } catch (e: any) {
         console.error(`AddEvent: Error encountered saving event details  ${e.toSting()}`);
         this.dialogsService.message("Error saving event details", "Error saving event details");
      } finally {
         this.busy.set(false);
      }
   }

   async uploadSplits(files: File[]) {
      this.busy.set(true);
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
         this.busy.set(false);
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

   async navigateToEvent(event: OEvent): Promise<boolean> {
      this.ses.setSelectedEvent(event);
      return await this.ses.navigateToEvent(event);
   }
}