import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Fixture } from 'app/model';
import { LatLong } from 'app/model/fixture';
import { UserDataService } from 'app/user/user-data.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
   selector: 'app-fixtures-grid',
   templateUrl: './fixtures-grid.component.html',
   styleUrls: ['./fixtures-grid.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush

})
export class FixturesGridComponent implements OnInit, OnChanges {

   private _selectedFixture: Fixture;
   displayData: Array<any> = [];
   itemSize: number;

   @Input() fixtures: Fixture[];

   @Input() set selectedFixture(f: Fixture) {
      if (f !== this._selectedFixture) {
         this.showElement(f);
      }
      this._selectedFixture = f;
   }

   @Input() homeLocation: LatLong;
   @Input() handset;

   @Output() fixtureSelected = new EventEmitter<Fixture>();

   @ViewChild(CdkVirtualScrollViewport, { static: false }) viewPort: CdkVirtualScrollViewport;

   likedEvents: string[] = [];

   constructor(private usd: UserDataService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
      this._registerGradeIcons(iconRegistry, sanitizer);
   }

   ngOnInit() {
      this.usd.userData().subscribe(userdata => {
         if (userdata) {
            this.likedEvents = userdata.reminders;
         }
      });
   }

   ngOnChanges() {
      if (this.handset) {
         this.itemSize = 120;
      } else {
         this.itemSize = 38;
      }
   }


   eventClicked(row: Fixture) {
      this._selectedFixture = row;
      this.fixtureSelected.emit(row);
   }

   selected(fixture: Fixture): boolean {
      if (this._selectedFixture && fixture) {
         return this._selectedFixture.id === fixture.id;
      } else {
         return false;
      }
   }

   trackBy(index, fix: Fixture) {
      return fix.id;
   }

   /** Load icons svg for event grades */
   private _registerGradeIcons(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
      iconRegistry.addSvgIcon('grade-local',
         sanitizer.bypassSecurityTrustResourceUrl('assets/img/event_grade/grade_local.svg')
      );
      iconRegistry.addSvgIcon('grade-club',
         sanitizer.bypassSecurityTrustResourceUrl('assets/img/event_grade/grade_club.svg')
      );
      iconRegistry.addSvgIcon('grade-regional',
         sanitizer.bypassSecurityTrustResourceUrl('assets/img/event_grade/grade_regional.svg')
      );
      iconRegistry.addSvgIcon('grade-national',
         sanitizer.bypassSecurityTrustResourceUrl('assets/img/event_grade/grade_national.svg')
      );
      iconRegistry.addSvgIcon('grade-international',
         sanitizer.bypassSecurityTrustResourceUrl('assets/img/event_grade/grade_international.svg')
      );
      iconRegistry.addSvgIcon('grade-iof',
         sanitizer.bypassSecurityTrustResourceUrl('assets/img/event_grade/grade_iof.svg')
      );
   }

   private showElement(fixture: Fixture) {
      const index = this.fixtures.findIndex(f => f === fixture);

      if (index !== -1 && this.viewPort) {
         this.viewPort.scrollToIndex(index);
      }
   }

   isLiked(eventId: string): boolean {
      if (!this.likedEvents) { return false; }
      return this.likedEvents.includes(eventId);
   }
}
