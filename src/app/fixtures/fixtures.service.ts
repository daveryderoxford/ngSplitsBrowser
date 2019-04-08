import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";
import { Fixture } from 'app/model/fixture';
import { UserDataService } from 'app/user/user-data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export type FixtureWeekPeriod = "Saturday" | "Sunday" | "Weekday";

@Injectable( {
   providedIn: 'root'
} )
export class FixturesService {

   _postcode = new BehaviorSubject<string>( "TW182AB" );
   _weekPeriod = new BehaviorSubject<FixtureWeekPeriod[]>( [] );

   constructor ( protected usd: UserDataService,
      protected storage: AngularFireStorage,
      protected http: HttpClient ) {

      this.usd.userData().subscribe( user => {
         this.setPostCode( user.postcode );
      } );

      this._weekPeriod.next( [ "Saturday", "Sunday", "Weekday" ] );
   }

   getFixtures(): Observable<Fixture[]> {

      const obs = this.storage.ref( "./fixtures/uk" ).getDownloadURL().pipe(
         switchMap( url => this.http.get( url, { responseType: 'text' } ).pipe(
            map( text => JSON.parse( text ) )
         )
         ) );

      return obs;
   }

   getPostcode(): Observable<string> {
      return this._postcode.asObservable();
   }

   setPostCode( postcode: string ) {
      this._postcode.next( postcode );
   }

   getWeekPeriod(): Observable<FixtureWeekPeriod[]> {
      return this._weekPeriod.asObservable();
   }

   setWeekPeriod( period: FixtureWeekPeriod[] ) {
      this._weekPeriod.next( period );
   }
}