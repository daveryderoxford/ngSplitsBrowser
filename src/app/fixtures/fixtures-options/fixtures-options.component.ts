import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, SimpleChanges } from '@angular/core';
import { Fixture, EventGrade } from 'app/model';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { GradeFilterComponent } from '../grade-filter-dialog/grade-filter-dialog.component';
import { GradeFilter, FixtureFilter, FixtureTimeFilter } from 'app/model/fixture-filter';


@Component( {
   selector: 'app-fixtures-options',
   templateUrl: './fixtures-options.component.html',
   styleUrls: [ './fixtures-options.component.scss' ]
} )
export class FixturesOptionsComponent implements OnInit, AfterViewInit {

   timeFilter$: BehaviorSubject<FixtureTimeFilter>;
   gradeOptions$: BehaviorSubject<GradeFilter[]>;

   @Input() postcode: string;
   @Input() filter: FixtureFilter;

   @Output() postcodeChanged = new EventEmitter<string>();
   @Output() filterChanged = new EventEmitter<FixtureFilter>();

   postcodeFormControl: FormControl;
   gradesEnabledControl: FormControl;

   constructor ( public dialog: MatDialog ) { }

   ngOnInit() {
      this.postcodeFormControl = new FormControl( '', [ this.validatePostcode, Validators.required ] );
      this.gradesEnabledControl = new FormControl();

      this.timeFilter$ = new BehaviorSubject( this.filter.time );
      this.gradeOptions$ = new BehaviorSubject( this.filter.grades );

      combineLatest( this.timeFilter$,
         this.gradesEnabledControl.valueChanges.pipe( startWith( this.filter.gradesEnabled )),
                     this.gradeOptions$ ).subscribe( ( [ time, gradeEnabled, gradeOptions ] ) => {
         const filter = {
            time: time,
            gradesEnabled: gradeEnabled,
            grades: gradeOptions
         };
         this.filterChanged.emit( filter );
      } );
   }

   ngAfterViewInit() {

   }

   postcodeEntered() {

      if ( !this.postcodeFormControl.valid ) {
         return;
      }
      const portcode = this.postcodeFormControl.value.trim().toUpperCase();
      this.postcodeChanged.emit( portcode );
   }

   validatePostcode( input: FormControl ) {
      const text = input.value.trim();

      if ( text === "" ) {
         return null;
      }
      const regex = /^[A-Z]{1,2}([0-9]{1,2}|[0-9][A-Z])\s*[0-9][A-Z]{2}$/gi;

      return regex.test( text ) ? null : { postcodeInvalid: true };
   }

   timeFilterChanged( val: FixtureTimeFilter ) {
      this.timeFilter$.next( val );
   }

   displayGrades() {
      // Display grade dialog

      const dialogRef = this.dialog.open( GradeFilterComponent, {
         width: '420px',
         data: this.gradeOptions$.value
      } );

      dialogRef.afterClosed().subscribe( gradeFilter => {
         console.log( 'The dialog was closed' );
         if ( gradeFilter) {
            this.gradeOptions$.next( gradeFilter );
         }
      } );
   }

}



