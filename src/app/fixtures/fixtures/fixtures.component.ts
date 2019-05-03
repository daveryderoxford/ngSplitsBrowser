import { Component, OnInit } from '@angular/core';
import { Fixture } from 'app/model';
import { LatLong } from 'app/model/fixture';
import { isSaturday, isSunday, isWeekend, differenceInMonths } from 'date-fns';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FixtureFilter, GradeFilter } from '../fixtures-options/fixtures-options.component';
import { FixturesService } from '../fixtures.service';
import { EventGrades } from 'app/model/oevent';
import { fileURLToPath } from 'url';

@Component( {
   selector: 'app-fixtures',
   templateUrl: './fixtures.component.html',
   styleUrls: [ './fixtures.component.scss' ]
} )

export class FixturesComponent implements OnInit {
   selectedFixture: Fixture;

   fixtures1: Fixture[];
   fixtures: Fixture[];
   homeLocation: Observable<LatLong>;
   postcode: Observable<string>;

    filter$ = new BehaviorSubject<FixtureFilter>( {
      time: { sat: true, sun: true, weekday: true },
      gradesEnabled: true,
      grades: this.makeDefaultGrades()
   } );

   displayedFixtures$: Observable<Fixture[]>;

   constructor ( public fs: FixturesService ) { }

   flilterFixtures( fixtures: Fixture[], fiilter: FixtureFilter ): Fixture[] {
      const res = fixtures.filter( (fix) => {
         const fixdate = new Date( fix.date );

         const timeOK = ( isSaturday( fixdate ) && fiilter.time.sat === true ) ||
            ( isSunday( fixdate ) && fiilter.time.sun === true ) ||
            ( !isWeekend( fixdate ) && fiilter.time.weekday === true );

          let gradeOK: boolean;
         if  (fiilter.gradesEnabled) {
            const f = fiilter.grades.find( (g) => fix.grade === g.name );
            gradeOK = f.enabled &&
            ( differenceInMonths( new Date(), fixdate ) <= f.time );
           // fix.distance < f.distance &&
         } else {
            gradeOK = true;
         }

         return timeOK && gradeOK;
      } );
      return res;
   }

   makeDefaultGrades(): GradeFilter[] {
      const filters = [];
      for (const grade of EventGrades.grades) {
         const filter: GradeFilter = {
            name: grade,
            enabled: true,
            distance: 100,
            time: 2
         };
         filters.push( filter );
      }
      return(filters);
   }

   ngOnInit() {

      this.fs.getFixtures().subscribe( f => this.fixtures1 = f );

      this.displayedFixtures$ = combineLatest( this.fs.getFixtures(), this.filter$ ).pipe(
         map( ( [ fixtures, filter ] ) => this.flilterFixtures( fixtures, filter ) )
      );

      this.displayedFixtures$.subscribe( f => this.fixtures = f );

      this.homeLocation = this.fs.getHomeLocation();
      this.postcode = this.fs.getPostcode();
   }

   onFeatureSelected( fixture: Fixture ) {
      this.selectedFixture = fixture;
   }

   postcodeChanged( p: string ) {
      this.fs.setPostcode( p );
   }

   filterChanged(filter: FixtureFilter) {
      this.filter$.next( filter);
   }

}


