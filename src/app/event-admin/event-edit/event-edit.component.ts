import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Club, Nations } from 'app/model';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { EventService } from '../../events/event.service';
import { ControlCardTypes, EventDisciplines, EventGrades, EventInfo, EventTypes, OEvent } from '../../model/oevent';
import { EventAdminService } from '../event-admin.service';

@UntilDestroy()
@Component( {
   selector: 'app-event-edit',
   templateUrl: './event-edit.component.html',
   styleUrls: [ './event-edit.component.scss' ]
} )
export class EventEditComponent implements OnInit, OnChanges {
   @Input() oevent: OEvent;
   new = true;
   @Output() eventSubmitted = new EventEmitter<EventInfo>();
   showProgressBar = false;

   f: UntypedFormGroup;
   grades = EventGrades.grades;
   nations = Nations.getNations();
   types = EventTypes.types;
   disciplines = EventDisciplines.disciplines;
   controlCardTypes = ControlCardTypes.types;

   clubs: Club[] = [];
   filteredClubs$: Observable<Club[]>;

   constructor ( private router: Router,
      private formBuilder: UntypedFormBuilder,
      private eventService: EventAdminService,
      private es: EventService,
      public snackBar: MatSnackBar
   ) {
      this.createForm();
   }

   private createForm() {
      this.f = this.formBuilder.group( {
         name: [ "", Validators.required ],
         date: [ "", Validators.required ],
         nationality: [ "", Validators.required ],
         club: [ "", Validators.required ],
         grade: [ "", Validators.required ],
         type: [ "", Validators.required ],
         discipline: [ "", Validators.required ],
         controlCardType: [ "", Validators.required ],
         webpage: [ "", Validators.pattern( /((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/i ) ]
      } );
   }

   ngOnInit() {

      this.filteredClubs$ = combineLatest( [ this.es.getClubs(),
             this.f.controls.club.valueChanges.pipe( startWith( '' ) ),
             this.f.controls.nationality.valueChanges.pipe( startWith( '' ) ) ] )
               .pipe(
                  map( ( [ clubs, name, nat ] ) => this.filterClubs( clubs, name, nat ) )
         ).pipe(untilDestroyed(this));

      this.filteredClubs$.subscribe( ( clubs ) => {
         this.clubs = clubs;
      } );
   }

   filterClubs( clubs: Club[], name: string, nationality: string ): Club[] {

      const ret: Club[] = [];

      if ( clubs ) {
         for ( const club of clubs ) {
            if ( !nationality || nationality === '' || club.nationality === nationality ) {
               if ( !name || name === '' ) {
                  ret.push( club );
               } else if ( club.name.startsWith( name.toUpperCase() ) ) {
                  ret.push( club );
               }
            }
         }
      }
      return ret;
   }

   displayClub( club?: Club ): string  {
      return club ? club.name : undefined;
   }

   ngOnChanges( changes: SimpleChanges ) {
      // set the form fields when the event is changed.
      if ( this.oevent === null ) {
         this.new = true;
         this.createForm();
         this.f.reset();
      } else {
         this.new = false;
         this.f.reset( this.oevent );
      }
   }

   cancel() {
      if ( this.f.dirty ) {
         // display a warning****
      }
   }

   private addhttp( url: string | null ): string | null {
      if ( url ) {
         if ( !/^(?:f|ht)tps?\:\/\//.test( url ) ) {
            url = "http://" + url;
         }
      }
      return url;
   }

   async submit() {

      if ( this.f.valid ) {

         try {
            this.showProgressBar = true;

            this.f.value.webpage = this.addhttp( this.f.value.webpage );

            if ( this.new ) {
               await this.eventService.saveNew( this.f.value );
            } else {
               await this.eventService.updateEventInfo( this.oevent.key, this.f.value );
            }
            this.showProgressBar = false;
         } catch ( err ) {
            this.showProgressBar = false;
            const snackBarRef = this.snackBar.open( "Error updating event information" );
            console.log( "EventEditComponent:  Error updating event information " + err );
         }

         //  this.eventSubmitted.emit(this.event);

      }
   }
}
