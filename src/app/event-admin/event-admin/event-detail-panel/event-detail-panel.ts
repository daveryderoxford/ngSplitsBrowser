import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { OEvent } from 'app/events/model/oevent';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';
import { FirebaseApp } from '@angular/fire/app';
import { MatButtonModule } from '@angular/material/button';

@Component({
   selector: 'app-event-details-panel',
   standalone: true,
   imports: [DatePipe, MatCardModule, MatListModule, MatIconModule, MatButtonModule],
   styles: `
      mat-card {
         background: white;
         padding: 10px;
      }
      .grid {
         display: grid;
         grid-template-columns: 120px 1fr;
         gap: 8px;
       } 
       
       td {
         text-align: center;
         padding-left: 15px;
         padding-right: 15px;
       }
      mat-divider {
         margin-top: 15px;
         margin-bottom: 15px;
      }
      .error {
         color: var(--mat-sys-on-error);
         background-color: var(--mat-sys-error);
         font-weight: bold;
         padding: 3px;
         padding-left: 7px;
         border-radius: 5px;
      }
   `,
   templateUrl: './event-detail-panel.html',
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsPanel {
   private storage = getStorage(inject(FirebaseApp));

   event = input<OEvent>();

   async downloadSplits(event: OEvent) {
      const url = await this.downloadLink(event.key);
      if (url) {
         console.log(`EventDetailsPanel: Downloading splits for event ${event.key} from ${url}`);
         window.open(url, '_blank');
      }
   }

   /** Get link to results file in google storage */
   public async downloadLink(key: string): Promise<string> {

      const path = isNaN(parseInt(key)) ?
         `results /${key} ` :
         `results/legacy/${key}`;

      const r = ref(this.storage, path);

      const url = await getDownloadURL(r);

      return url;
   }

   formatCourseLength(length: number): string {
      if (!length || length === 0) return '';
      if (length > 1000) length = length / 1000;
      return (Math.round(length * 10) / 10).toFixed(1);
   }
}