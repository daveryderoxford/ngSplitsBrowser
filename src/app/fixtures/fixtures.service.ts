import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { UserData } from 'app/model';
import { Fixture, LatLong } from 'app/model/fixture';
import { FixtureFilter, GradeFilter } from 'app/model/fixture-filter';
import { UserDataService } from 'app/user/user-data.service';
import { differenceInMonths, isFuture, isSaturday, isSunday, isToday, isWeekend } from 'date-fns';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

@Injectable( {
   providedIn: 'root'
} )
export class FixturesService {

   private _postcode$ = new BehaviorSubject<string>( "TW18 2AB" );
   private _homeLocation$ = new BehaviorSubject<LatLong>( { "lat": 51.43116, "lng": -0.508227, } );

   private _filter$ = new BehaviorSubject<FixtureFilter>( {
      time: { sat: true, sun: true, weekday: true },
      gradesEnabled: true,
      grades: this._makeDefaultGrades(),
      likedOnly: false
   } );

   private _fileContents$: Observable<Fixture[]> = this.storage.ref( "fixtures/uk" ).getDownloadURL().pipe(
      switchMap( url => this.http.get<Fixture[]>( url ) ),
      map( fixtures => this._futureFixtures( fixtures ) ),
      startWith( [] ),
      shareReplay( 1 ),
      catchError( this.handleError<Fixture[]>( 'Fixture download', [] ) )
   );

   private _selectedFixture$ = new BehaviorSubject<Fixture | null>( null );

   constructor (
      protected usd: UserDataService,
      protected storage: AngularFireStorage,
      protected fs: AngularFirestore,
      protected http: HttpClient ) {

      /* When user changes - set filters to reflect user details and unset liked only */
      this.usd.user$.subscribe( user => {
         if ( user ) {
            if ( user.postcode && user.postcode !== "" ) {
               this.updatePostcode( user.postcode );
            }
            if ( user.fixtureGradeFilters ) {
               this.updateFilter( { ...this._filter$.value, grades: user.fixtureGradeFilters } ); 
            }
         } else {
            // set likedonly to false on logout
            this.updateFilter( { ...this._filter$.value, likedOnly: false } );
         }
      } );

   }

   allFixtues(): Observable<Fixture[]> {
      return this._fileContents$;
   }

   getFixtures(): Observable<Fixture[]> {

      const fixturesWithDistance$ = combineLatest( [this._fileContents$, this._homeLocation$] ).pipe(
         map( ( [fixtures, loc] ) => {
            const n = fixtures.map( fix => {
               fix.distance = this._distanceFromHome( fix, loc );
               return fix;
            } );
            return n;
         }
         ),
         shareReplay( 1 ),
      );

      const fixturesObs$ = combineLatest( [fixturesWithDistance$, this.usd.user$, this._filter$] ).pipe(
         map( ( [fixtures, userdata, ftr] ) => fixtures.filter( fix => this._showFixture( fix, userdata, ftr ) ) )
      );

      return fixturesObs$;
   }

   private _futureFixtures( fixtures: Fixture[] ): Fixture[] {
      return fixtures.filter( fix => {
         const d = new Date( fix.date );
         return isToday( d ) || isFuture( d );
      } );
   }

   getSelectedFixture$(): Observable<Fixture> {
      return this._selectedFixture$.asObservable();
   }

   updateSelectedFixture( fixture: Fixture ) {
      this._selectedFixture$.next( fixture );
   }

   public _showFixture( fix: Fixture, userdata: UserData, ftr: FixtureFilter ): boolean {

      const fixdate = new Date( fix.date );

      const timeFilterPassed = ( isSaturday( fixdate ) && ftr.time.sat === true ) ||
         ( isSunday( fixdate ) && ftr.time.sun === true ) ||
         ( !isWeekend( fixdate ) && ftr.time.weekday === true );

      let gradeOFilterPassed: boolean;
      if ( ftr.gradesEnabled ) {
         const gradeFilter = ftr.grades.find( ( grade ) => grade.name === fix.grade );

         gradeOFilterPassed = gradeFilter.enabled &&
            differenceInMonths( fixdate, new Date() ) <= gradeFilter.time &&
            fix.distance < gradeFilter.distance;
      } else {
         gradeOFilterPassed = true;
      }

      let isLiked = false;
      const likedOnly = ftr.likedOnly;
      isLiked = userdata?.reminders.includes( fix.id );
      
      // For liked only show all liked events.  Otherwise filter based on time and grade fiilters
      return likedOnly ? isLiked : timeFilterPassed && gradeOFilterPassed;

   }

   getHomeLocation(): Observable<LatLong> {
      return this._homeLocation$.asObservable();
   }

   /** Updates the postcode used for fixture location calculation
    * Returns promise containg the calculated lat long or null if the latlong could not be calculated 
    */
   async updatePostcode( postcode: string ): Promise<LatLong | null> {

      const latlng = await this._calcLatLong( postcode ).toPromise();

      if ( latlng ) {
         this._postcode$.next( postcode );
         this._homeLocation$.next( latlng );
      } else {
         console.log( `FixturesService: Not updating home location as latlong could not be determined for ${postcode}` );
      }

      return ( latlng );

   }

   getPostcode(): Observable<string> {
      return this._postcode$.asObservable();
   }

   updateFilter( f: FixtureFilter ) {
      this._filter$.next( f );
   }

   getFilter(): Observable<FixtureFilter> {
      return this._filter$.asObservable();
   }

   private _makeDefaultGrades(): GradeFilter[] {
      return [
         { name: 'IOF', enabled: true, distance: 1000, time: 48 },
         { name: 'International', enabled: true, distance: 1000, time: 48 },
         { name: 'National', enabled: true, distance: 500, time: 12 },
         { name: 'Regional', enabled: true, distance: 100, time: 12 },
         { name: 'Club', enabled: true, distance: 60, time: 6 },
         { name: 'Local', enabled: true, distance: 40, time: 2 },
      ];
   }

   /** Calculate lat long from postcode, returning null if lat/long could not be calculated  */
   private _calcLatLong( postcode: string ): Observable<LatLong | null> {
      const obs = this.http.get<any>( "https://api.postcodes.io/postcodes/" + postcode ).pipe(
         catchError( this.handleError<LatLong>( 'FixturesService: Postcode location failed', null ) ),
         map( obj => {
            if ( obj === null || obj.result === null || obj.result.latitude === null ) {
               return null;
            }
            const loc: LatLong = {
               lat: obj.result.latitude,
               lng: obj.result.longitude
            };
            return loc;
         }
         ),
         tap( obj => console.log( `FixturesService: Calculaing latlong for postcode: ${postcode} lat: ${obj?.lat} long: ${obj?.lng}` ) )
      );

      return obs;
   }

   private _getDistanceFromLatLngInKm( pos1: LatLong, pos2: LatLong ): number {
      const R = 6371; // Radius of the earth in km
      const dLat = this._deg2rad( pos2.lat - pos1.lat );  
      const dLon = this._deg2rad( pos2.lng - pos1.lng );
      const a =
         Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
         Math.cos( this._deg2rad( pos1.lat ) ) * Math.cos( this._deg2rad( pos2.lat ) ) *
         Math.sin( dLon / 2 ) * Math.sin( dLon / 2 );
      const c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );
      const d = R * c; // Distance in km
      return d;
   }

   private _deg2rad( deg: number ): number {
      return deg * ( Math.PI / 180 );
   }

   private _distanceFromHome( fix: Fixture, home: LatLong ): number {
      const kmToMiles = 0.62137119224;
      if ( !home || !fix.latLong ) {
         return -1;
      }
      const dist = this._getDistanceFromLatLngInKm( home, fix.latLong );
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
