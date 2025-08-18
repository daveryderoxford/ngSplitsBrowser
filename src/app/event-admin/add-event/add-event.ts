/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { AfterViewInit, Component, inject, signal, viewChild } from '@angular/core';
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
            const msg = results.warnings.reduce((acc = '', warn) => acc + '
' + warn);
            await this.dialogsService.message("Warnings uploading splits",
               "Splits uploaded with the following warning messages
" + msg);
         }
         this.stepper().selected.completed = true;
         this.stepper().next();
      } catch (err) {
         console.log("EventAdminComponnet: Error uploading splits
 " + err);
         this.dialogsService.message("Error uploading splits", "Error uploading splits
" + err);
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

}
