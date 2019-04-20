import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";
import { Fixture, LatLong } from 'app/model/fixture';
import { UserDataService } from 'app/user/user-data.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith, tap, switchMap } from 'rxjs/operators';

export type FixtureWeekPeriod = "Saturday" | "Sunday" | "Weekday";

@Injectable( {
   providedIn: 'root'
} )
export class FixturesService {

   _postcode = new BehaviorSubject<string>( "TW182AB");
   _homeLocation = new BehaviorSubject<LatLong>( { lat: 51.509865, lng: -0.118092 } );
   _weekPeriod = new BehaviorSubject<FixtureWeekPeriod[]>( [] );

   constructor ( protected usd: UserDataService,
      protected storage: AngularFireStorage,
      protected http: HttpClient ) {

      this.usd.userData().subscribe( user => {
         if (user && user.postcode && user.postcode !== "") {
            this.setPostcode( user.postcode );
         }
      } );

      this._weekPeriod.next( [ "Saturday", "Sunday", "Weekday" ] );
   }

   getFixtures(): Observable<Fixture[]> {

      const obs = this.storage.ref( "fixtures/uk" ).getDownloadURL().pipe(
         switchMap( url => this.http.get<Fixture[]>( url ) ),
         startWith( [] ),
         catchError( this.handleError<Fixture[]>( 'Fixture download', [] ) )
      );

      return obs;
   }

   getPostcode(): Observable<string> {
      return this._postcode.asObservable();
   }

   getHomeLocation(): Observable<LatLong> {
      return this._homeLocation.asObservable();
   }

   setPostcode( postcode: string ) {

      this.calcLatLong( postcode )
      .subscribe( latlong => {
         this._postcode.next( postcode );
         this._homeLocation.next( latlong );
      });
   }

   getWeekPeriod(): Observable<FixtureWeekPeriod[]> {
      return this._weekPeriod.asObservable();
   }

   setWeekPeriod( period: FixtureWeekPeriod[] ) {
      this._weekPeriod.next( period );
   }

   private calcLatLong( postcode: string ): Observable<LatLong> {
      const obs = this.http.get<any>( "https://api.postcodes.io/postcodes/" + postcode).pipe(
         catchError( this.handleError<LatLong>( 'FixturesService: Postcode location failed', null) ),
         map( obj => {
            const l: LatLong = { lat: obj.result.latitude, lng: obj.result.longitude };
            return l;
            }
         ),
         tap( obj => console.log("FixturesService::  lat: " + obj.lat +  "long: " + obj.lng))
      );

      return obs;
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
         console.error(operation + error );

         // TODO: better job of transforming error for user consumption
       //  this.log( `${operation} failed: ${error.message}` );

         // Return default result.
         return of( result as T );
      };
   }
}
