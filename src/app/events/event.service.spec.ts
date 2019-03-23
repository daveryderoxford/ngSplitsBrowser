import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { FirestoreTestUtil } from 'app/test/local-firebase.spec';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { testFirebaseConfig } from 'app/app.firebase-config';
import { PaganationService } from 'app/shared';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { test_clubs, test_events, test_results } from 'app/test/testdata.spec';
import { Club } from 'app/model';
import { filter } from 'rxjs/operators';

function checkClub( club: Club, name: string, nat: string, msg?: string ) {
   expect( club.name ).toEqual( name, 'check of name for ' + msg );
   expect( club.nationality ).toEqual( nat, 'check of nationality for ' + msg );
}

let fstest: FirestoreTestUtil;
let service: EventService;
let user: firebase.auth.UserCredential;

fdescribe( 'EventService', () => {

   beforeAll( async () => {
      console.log( 'BeforeAll' );

      configureAgular();

      console.log( 'Populating database' );
      expect( service ).toBeTruthy();

      fstest = new FirestoreTestUtil();
      user = await fstest.logon();
      console.log( 'logged on as ' + user.user.displayName );

      await fstest.loadDefaultData();
      expect( fstest ).toBeTruthy();
   });

   function configureAgular() {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule( {
         imports: [
            AngularFireModule.initializeApp( testFirebaseConfig ),
            AngularFirestoreModule,
            AngularFireAuthModule
         ],
         providers: [ EventService, AngularFireAuth, AngularFirestore, PaganationService ]
      } );
      service = TestBed.get( EventService );
   }

   beforeEach( () => {
      console.log( 'BeforeEach' );
      configureAgular();
   });

   it( 'should be created', () => {
      expect( service ).toBeTruthy();
   });

   it( 'shall get clubs ordered by name/nationality',  ( done ) => {

      fstest = new FirestoreTestUtil();

         service.getClubs().subscribe( ( clubs ) => {
         console.log( 'Clubs retrived ' );

         expect( clubs.length ).toEqual( 3 );
         checkClub( clubs[ 0 ], 'SN', 'GBR', 'first club' );
         checkClub( clubs[ 1 ], 'SN', 'NOR', 'second club' );
         checkClub( clubs[ 2 ], 'TVOC', 'GBR', 'third club' );
         done();
      } );
   } );

   it( 'shall get events for club ordered by date',  ( done ) => {

      service.getEventsForClub( test_clubs[ 0 ] ).subscribe( oevents => {
         console.log( 'Evens retrived ' );
         expect( oevents.length ).toEqual( 1 );
         expect( oevents[ 0 ].name ).toEqual( 'Event B' );
         done();
      } );
   }, 10000 );

   it( 'shall search for events with no search criteria', ( done ) => {

      service.search( 'date', null, 1 ).subscribe( oevents => {
         // Wait for first event to be reported, Initially we will get null.
         if ( oevents.length === 1 ) {
            expect( oevents.length ).toEqual( 1 );
            expect( oevents[ 0 ].name ).toEqual( 'Event B' );
            done();
         }
      } );
   } );

   xit( 'shall get additional pages of events', ( done ) => {

      const obs = service.search( 'date', null, 1 );

      service.extendSearch();

      obs.subscribe( oevents => {
         if ( oevents.length === 2 ) {
            expect( oevents.length ).toEqual( 2 );
            expect( oevents[ 0 ].name ).toEqual( 'Event B' );
            expect( oevents[ 1 ].name ).toEqual( 'Event A' );
            done();
         }
      } );

   } );

} );
