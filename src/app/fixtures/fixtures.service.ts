import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";
import { Fixture, LatLong } from 'app/model/fixture';
import { FixtureFilter, GradeFilter } from 'app/model/fixture-filter';
import { FixtureReservation } from 'app/model/fixture-reservation';
import { UserDataService } from 'app/user/user-data.service';
import { differenceInMonths, isFuture, isSaturday, isSunday, isToday, isWeekend } from 'date-fns';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

@Injectable( {
   providedIn: 'root'
} )
export class FixturesService {

   _postcode$ = new BehaviorSubject<string>( "TW18 2AB" );
   _homeLocation$ = new BehaviorSubject<LatLong>( { "lat": 51.43116, "lng": -0.508227, } );

   _filter$ = new BehaviorSubject<FixtureFilter>( {
      time: { sat: true, sun: true, weekday: true },
      gradesEnabled: true,
      grades: this.makeDefaultGrades()
   } );

   _userData$ = this.afAuth.authState.pipe( switchMap( () => this.usd.userData() ) );

   _fileContents: Observable<Fixture[]> = this.storage.ref( "fixtures/uk" ).getDownloadURL().pipe(
      switchMap( url => this.http.get<Fixture[]>( url ) ),
      map( fixtures => this.futureFixtures( fixtures ) ),
      shareReplay(),
      startWith( [] ),
      catchError( this.handleError<Fixture[]>( 'Fixture download', [] ) )
   );

   constructor (
      private afAuth: AngularFireAuth,
      protected usd: UserDataService,
      protected storage: AngularFireStorage,
      protected fs: AngularFirestore,
      protected http: HttpClient ) {

      this.afAuth.authState.pipe(
         filter( user => user !== null ),    // Only handle login requests
         switchMap( () => this.usd.userData() ),
      ).subscribe( userdata => {
         // TODO User data should always be not null here check
         if ( userdata && userdata.postcode && userdata.postcode !== "" ) {
            this.setPostcode( userdata.postcode );
         }
         if ( userdata && userdata.fixtureGradeFilters ) {
            const newFilter: FixtureFilter = Object.assign( {}, this._filter$.value );
            newFilter.grades = userdata.fixtureGradeFilters;
            this.setFilter( newFilter );
         }
      } );
   }

   getFixtures(): Observable<Fixture[]> {

      const fixturesWithDistance$ = combineLatest( [ this._fileContents, this._homeLocation$ ] ).pipe(
         map( ( [ fixtures, loc ] ) => {
            const n = fixtures.map( fix => {
               fix.distance = this.distanceFromHome( fix, loc );
               return fix;
            } );
            return n;
         }
         ),
         shareReplay(),
      );

      const fixturesObs$ = combineLatest( [ fixturesWithDistance$, this._filter$ ] ).pipe(
         map( ( [ fixtures, ftr ] ) => fixtures.filter( fix => !this.isHidden(fix, ftr)) )
      );

      return fixturesObs$;
   }

   private futureFixtures( fixtures: Fixture[] ): Fixture[] {
      return fixtures.filter( fix => {
         const d = new Date( fix.date );
         return isToday( d ) || isFuture( d );
      } );
   }

   private isHidden( fix: Fixture, ftr: FixtureFilter ): boolean {

      const fixdate = new Date( fix.date );

      const timeOK = ( isSaturday( fixdate ) && ftr.time.sat === true ) ||
         ( isSunday( fixdate ) && ftr.time.sun === true ) ||
         ( !isWeekend( fixdate ) && ftr.time.weekday === true );

      let gradeOK: boolean;
      if ( ftr.gradesEnabled ) {
         const gradeFilter = ftr.grades.find( ( g ) => fix.grade === g.name );

         gradeOK = gradeFilter.enabled &&
            differenceInMonths( fixdate, new Date() ) <= gradeFilter.time &&
            fix.distance < gradeFilter.distance;
      } else {
         gradeOK = true;
      }

      return !timeOK || !gradeOK;

   }

   getPostcode(): Observable<string> {
      return this._postcode$.asObservable();
   }

   getHomeLocation(): Observable<LatLong> {
      return this._homeLocation$.asObservable();
   }

   setPostcode( postcode: string ) {

      this.calcLatLong( postcode )
         .subscribe( latlong => {
            this._postcode$.next( postcode );
            this._homeLocation$.next( latlong );
         } );
   }

   setFilter( f: FixtureFilter ) {
      this._filter$.next( f );
   }

   getFilter(): Observable<FixtureFilter> {
      return this._filter$.asObservable();
   }

   /** Adds a new map reservation for a fixture. Throws an exception if one already exists for the fixture */
   async addMapReservation( id: string, reservation: FixtureReservation ): Promise<void> {
      const doc = this.fs.doc<FixtureReservation>( '/enteries/' + id );

      try {
         const res = await doc.valueChanges().toPromise();
         await doc.set( reservation );
      } catch ( e ) {
         console.log( 'FixtureService: Error adding map reservation:' + e.message );
         throw e;
      }
   }

   private makeDefaultGrades(): GradeFilter[] {
      return [
         { name: 'IOF', enabled: true, distance: 1000, time: 48 },
         { name: 'International', enabled: true, distance: 1000, time: 48 },
         { name: 'National', enabled: true, distance: 500, time: 12 },
         { name: 'Regional', enabled: true, distance: 1000, time: 12 },
         { name: 'Club', enabled: true, distance: 60, time: 6 },
         { name: 'Local', enabled: true, distance: 40, time: 2 },
      ];
   }


   private calcLatLong( postcode: string ): Observable<LatLong> {
      const obs = this.http.get<any>( "https://api.postcodes.io/postcodes/" + postcode ).pipe(
         catchError( this.handleError<LatLong>( 'FixturesService: Postcode location failed', null ) ),
         map( obj => {
            const l: LatLong = { lat: obj.result.latitude, lng: obj.result.longitude };
            return l;
         }
         ),
         tap( obj => console.log( "FixturesService::  lat: " + obj.lat + "long: " + obj.lng ) )
      );

      return obs;
   }

   private getDistanceFromLatLonInKm( pos1: LatLong, pos2: LatLong ): number {
      const R = 6371; // Radius of the earth in km
      const dLat = this.deg2rad( pos2.lat - pos1.lat );  // deg2rad below
      const dLon = this.deg2rad( pos2.lng - pos1.lng );
      const a =
         Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
         Math.cos( this.deg2rad( pos1.lat ) ) * Math.cos( this.deg2rad( pos2.lat ) ) *
         Math.sin( dLon / 2 ) * Math.sin( dLon / 2 );
      const c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );
      const d = R * c; // Distance in km
      return d;
   }

   private deg2rad( deg: number ): number {
      return deg * ( Math.PI / 180 );
   }

   private distanceFromHome( fix: Fixture, home: LatLong ): number {
      const kmToMiles = 0.62137119224;
      if ( !home || !fix.latLong ) {
         return -1;
      }
      const dist = this.getDistanceFromLatLonInKm( home, fix.latLong );
      return Math.round( dist * kmToMiles );
   }

   /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
   private handleError<T>( operation = 'operation', result?: T ) {
      return ( error: any ): Observable<T> => {

         // TODO: send the error to remote logging infrastructure
         console.error( operation + error );

         // TODO: better job of transforming error for user consumption
         //  this.log( `${operation} failed: ${error.message}` );

         // Return default result.
         return of( result as T );
      };
   }
}
