import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";
import { UserData } from 'app/model';
import { Fixture, LatLong } from 'app/model/fixture';
import { FixtureFilter, GradeFilter } from 'app/model/fixture-filter';
import { UserDataService } from 'app/user/user-data.service';
import { differenceInMonths, isFuture, isSaturday, isSunday, isToday, isWeekend } from 'date-fns';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

@Injectable( {
   providedIn: 'root'
} )
export class FixturesService {

   private _postcode$ = new BehaviorSubject<string>( "TW18 2AB" );
   private _homeLocation$ = new BehaviorSubject<LatLong>( { "lat": 51.43116, "lng": -0.508227, } );

   private _filter$ = new BehaviorSubject<FixtureFilter>( {
      time: { sat: true, sun: true, weekday: true },
      gradesEnabled: true,
      grades: this.makeDefaultGrades(),
      likedOnly: false
   } );

   private _fileContents$: Observable<Fixture[]> = this.storage.ref( "fixtures/uk" ).getDownloadURL().pipe(
      switchMap( url => this.http.get<Fixture[]>( url ) ),
      map( fixtures => this.futureFixtures( fixtures ) ),
      shareReplay(1),
      startWith( [] ),
      catchError( this.handleError<Fixture[]>( 'Fixture download', [] ) )
   );

   private _selectedFixture$ = new BehaviorSubject<Fixture | null>(null);

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

      const fixturesWithDistance$ = combineLatest( [ this._fileContents$, this._homeLocation$ ] ).pipe(
         map( ( [ fixtures, loc ] ) => {
            const n = fixtures.map( fix => {
               fix.distance = this.distanceFromHome( fix, loc );
               return fix;
            } );
            return n;
         }
         ),
         shareReplay(1),
      );

      const fixturesObs$ = combineLatest( [ fixturesWithDistance$, this.usd.userData(), this._filter$ ] ).pipe(
         map( ( [fixtures, userdata, ftr] ) => fixtures.filter( fix => this.showFixture(fix, userdata, ftr)) )
      );

      return fixturesObs$;
   }

   private futureFixtures( fixtures: Fixture[] ): Fixture[] {
      return fixtures.filter( fix => {
         const d = new Date( fix.date );
         return isToday( d ) || isFuture( d );
      } );
   }

   getSelectedFixture$(): Observable<Fixture> {
      return this._selectedFixture$.asObservable();
   }

   setSelectedFixture(fixture: Fixture) {
      this._selectedFixture$.next(fixture);
   }

   private showFixture( fix: Fixture, userdata: UserData, ftr: FixtureFilter ): boolean {

      const fixdate = new Date( fix.date );

      const timeOK = ( isSaturday( fixdate ) && ftr.time.sat === true ) ||
         ( isSunday( fixdate ) && ftr.time.sun === true ) ||
         ( !isWeekend( fixdate ) && ftr.time.weekday === true );

      let gradeOK: boolean;
      if ( ftr.gradesEnabled ) {
         const gradeFilter = ftr.grades.find( ( grade ) => grade.name === fix.grade);

         gradeOK = gradeFilter.enabled &&
            differenceInMonths( fixdate, new Date() ) <= gradeFilter.time &&
            fix.distance < gradeFilter.distance;
      } else {
         gradeOK = true;
      }

      let likedOk: boolean;
      if ( ftr.likedOnly ) {
         if (userdata) {
            likedOk = userdata.reminders.includes(fix.id);
         } else {
            likedOk = true;
         }
      } else {
         likedOk = true;
      }

      return timeOK && gradeOK && likedOk;

   }

   getPostcode(): Observable<string> {
      return this._postcode$.asObservable();
   }

   getHomeLocation(): Observable<LatLong> {
      return this._homeLocation$.asObservable();
   }

   /** Sets the postcode - Retruns an obsevable of the calculated lat long or null f the latlong could not be calculated   */
   setPostcode( postcode: string ): Observable<LatLong | null>  {

      return this.calcLatLong( postcode ).pipe(
         tap ( latlong => {
            if (latlong) {
               this._postcode$.next( postcode );
               this._homeLocation$.next( latlong );
            }
         } ) );
 
   }

   setFilter( f: FixtureFilter ) {
      this._filter$.next( f );
   }

   getFilter(): Observable<FixtureFilter> {
      return this._filter$.asObservable();
   }


   private makeDefaultGrades(): GradeFilter[] {
      return [
         { name: 'IOF', enabled: true, distance: 1000, time: 48 },
         { name: 'International', enabled: true, distance: 1000, time: 48 },
         { name: 'National', enabled: true, distance: 500, time: 12 },
         { name: 'Regional', enabled: true, distance: 100, time: 12 },
         { name: 'Club', enabled: true, distance: 60, time: 6 },
         { name: 'Local', enabled: true, distance: 40, time: 2 },
      ];
   }

   /** Calculate lat long from postcase, returning null if lat/long could not be calculated  */
   private calcLatLong( postcode: string ): Observable<LatLong | null> {
      const obs = this.http.get<any>( "https://api.postcodes.io/postcodes/" + postcode ).pipe(
         catchError( this.handleError<LatLong>( 'FixturesService: Postcode location failed', null ) ),
         map( obj => {
            if ( obj === null || obj.result === null || obj.result.latitude === null) {
               return null;
            }
            const loc: LatLong = {
               lat: obj.result.latitude,
               lng: obj.result.longitude
            };
            return loc;
         }
         ),
         tap( obj => console.log( "FixturesService::  lat: " + obj?.lat + "long: " + obj?.lng ) )
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
         console.log( operation + error );

         // TODO: better job of transforming error for user consumption
         //  this.log( `${operation} failed: ${error.message}` );

         // Return default result.
         return of( result as T );
      };
   }
}
