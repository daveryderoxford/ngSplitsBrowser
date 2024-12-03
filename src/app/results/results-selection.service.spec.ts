
import 'jasmine-expect';
import { eventA, resultsa } from "app/test/testdata.spec";
import { of, zip } from "rxjs";
import { ResultsSelectionService } from "./results-selection.service";
import { filter } from 'rxjs/operators';

let httpClientSpy: { get: jasmine.Spy };

let angularFirestoreSpy: {
   doc: jasmine.Spy,
   collection: jasmine.Spy,
};

let angularFireStorageSpy: {
   ref: jasmine.Spy;
};

let service: ResultsSelectionService;

describe( "ResultsSelectionService", () => {
   beforeEach( () => {
      httpClientSpy = jasmine.createSpyObj( 'HttpClient', [ 'get' ] );
      angularFireStorageSpy = jasmine.createSpyObj( 'AngularFireStorage', [ 'ref' ] );
      angularFirestoreSpy = jasmine.createSpyObj( 'AngularFirestore', [ 'doc' ] );

      service = new ResultsSelectionService( <any> angularFirestoreSpy, <any> angularFireStorageSpy, <any> httpClientSpy );

   } );

   it( "should be created", () => {
      expect( service ).toBeTruthy();
   } );

   it( "should load results for an event", ( done: DoneFn ) => {

      spyOn( service, "downloadResultsFile" ).and.returnValue( of( resultsa ) );

      service.loadResults( eventA ).subscribe( results => {
         expect( results.classes.length ).toEqual( 4 );
         expect( results.allCompetitors.length ).toEqual( 7 );
         done();
      } );

   } );

   it( "should set selected event and emit the relivant events", ( done: DoneFn ) => {

      spyOn( service, "downloadResultsFile" ).and.returnValue( of( resultsa ) );

      /* Zip waits for for all expected observables to emit then emits array of value obtained. */
      const expectedObservables = zip( service.selectedResults,
         service.competitors,
         service.control,
         service.oclass,
         service.course );

      service.setSelectedEvent( eventA ).subscribe( oevent => {
         console.log( 'Event selected' );
         // Register for obervables and check they are correct.
         expectedObservables.subscribe( ( [ result, comps, control, oclass, course ] ) => {
            expect( result.classes.length ).toEqual( 4 );
            expect( comps ).toEqual( [], 'Selected competitor validation' );
            expect( control ).toEqual( null, 'Selected control validation' );
            expect( oclass ).toEqual( result.classes[ 0 ], 'Class validation' );
            expect( course ).toEqual( result.classes[ 0 ].course, 'Course validation' );
            done();
         } );
      } );
   } );

   xit( "should raise an error is selected result does not exist", ( done: DoneFn ) => {

      spyOn( service, "downloadResultsFile" ).and.returnValue( of( resultsa ) );
      spyOn( service, "parseSplits" ).and.throwError( 'Parse Error');

      service.setSelectedEvent( eventA ).subscribe(
         () => expect(true).toBe(false),
         err => expect( err ).toBeString(),
         () => console.log( 'Select event completed.' )
      );
   } );

   it( "Selected class", async ( done: DoneFn ) => {

      spyOn( service, "downloadResultsFile" ).and.returnValue( of( resultsa ) );

      let eventcount = 0;
      service.oclass.subscribe( ( oclass ) => {
         if ( oclass ) {
            console.log( 'Class selected: ' + oclass.name );
         }
         if ( eventcount === 0 ) {
            // null initial state of class when subscribing on startup with no results loaded
            expect( oclass ).toEqual( null );
         } else if ( eventcount === 1 ) {
            // first class default when results are loaded
            expect( oclass.name ).toEqual( 'Class A' );
         } else if ( eventcount === 2 ) {
            // class C selefted next
            expect( oclass.name ).toEqual( 'Class C' );
            // class B selected last
         } else if ( eventcount === 3 ) {
            expect( oclass.name ).toEqual( 'Class B' );
            done();
         }
         eventcount++;
      } );

      const results = await service.setSelectedEvent( eventA ).toPromise();

      service.selectClass( results.classes[ 2 ] );
      service.selectClass( results.classes[ 1 ] );

   } );

   it( "Selected course when class is selected", async ( done: DoneFn ) => {

      spyOn( service, "downloadResultsFile" ).and.returnValue( of( resultsa ) );

      let eventcount = 0;
      service.course.subscribe( ( course ) => {
         if ( course ) {
            console.log( 'Course selected: ' + course.name );
         }
         if ( eventcount === 0 ) {
            // null initial state of course when subscribing on startup with no results loaded
            expect( course ).toEqual( null );
         } else if ( eventcount === 1 ) {
            // course for first class  default when results are loaded
            expect( course.name ).toEqual( 'Course 1' );
         } else if ( eventcount === 2 ) {
            // class C selected next - has course 2
            expect( course.name ).toEqual( 'Course 2' );
            // class B selected last also on course 2
         } else if ( eventcount === 3 ) {
            expect( course.name ).toEqual( 'Course 2' );
            done();
         }
         eventcount++;
      } );

      const results = await ( service.setSelectedEvent( eventA ).toPromise() );

      service.selectClass( results.classes[ 2 ] );
      service.selectClass( results.classes[ 1 ] );

   } );
   it( "Selected competitors", async ( done: DoneFn ) => {

      spyOn( service, "downloadResultsFile" ).and.returnValue( of( resultsa ) );

      let eventcount = 0;
      service.competitors.subscribe( ( comps ) => {
         if ( comps ) {
            console.log( 'Selected competitors number: ' + comps.length );
         }
         if ( eventcount === 0 ) {
            // null initial state of course when subscribing on startup with no results loaded
            expect( comps ).toEqual( [] );
         } else if ( eventcount === 1 ) {
            // course for first class  default when results are loaded.  ordering by class then time
            expect( comps.length ).toEqual( 3 );
            expect( comps[ 0 ] ).toEqual( results.classes[ 0 ].competitors[ 1 ]);
         } else if ( eventcount === 2 ) {
            // deselect multiple competitors
            expect( comps.length ).toEqual( 1 );
            expect( comps[ 0 ] ).toEqual( results.classes[ 1 ].competitors[ 1 ]);
            done();
         }
         eventcount++;
      } );

      const results = await ( service.setSelectedEvent( eventA ).toPromise() );

      // Select single competitors in selected class
      service.selectCompetitors( results.classes[0].competitors[1]);

      // Select multiple competitors not in selected class
      service.selectCompetitors( results.classes[ 1 ].competitors[ 1 ], results.classes[ 1 ].competitors[ 0 ]  );

      // Select class and see if competitors change.. There should be no change.
      service.selectClass( results.classes[ 1 ] );

      // deselect competitorno currently selected - no change expected
      service.deselectCompetitors( results.classes[ 0 ].competitors[ 0 ] );

      // deselect competitor not curretly seleced
      service.deselectCompetitors( results.classes[ 1 ].competitors[ 0 ], results.classes[ 0 ].competitors[ 1 ] );

   } );

   it( "Displayed competitors filtered by class", async ( done: DoneFn ) => {

      spyOn( service, "downloadResultsFile" ).and.returnValue( of( resultsa ) );

      const compsSelected = zip( service.displayedCompetitors, service.displayedCompetitors );

      let eventcount = 0;
      compsSelected.subscribe( ( [ displayed, selected ] ) => {
         if ( displayed ) {
            console.log( 'Selected competitors number: ' + displayed.length, '  Number selected:  ' + selected.length );
         }
         if ( eventcount === 0 ) {
            // null initial state of course when subscribing on startup with no results loaded
            expect( displayed ).toEqual( [] );
            expect( selected ).toEqual( [] );

         } else if ( eventcount === 1 ) {
            // course for first class  default when results are loaded.  ordering by class then time
            expect( displayed.length ).toEqual( 3 );
            expect( displayed[ 0 ] ).toEqual( results.classes[ 0 ].competitors[ 1 ] );
         } else if ( eventcount === 2 ) {
            // deselect multiple competitors
            expect( displayed.length ).toEqual( 1 );
            expect( displayed[ 0 ] ).toEqual( results.classes[ 1 ].competitors[ 1 ] );
            done();
         }
         eventcount++;
      } );

      const results = await ( service.setSelectedEvent( eventA ).toPromise() );

      // Select single competitors in selected class
      service.selectCompetitors( results.classes[ 0 ].competitors[ 1 ] );

      // Select multiple competitors not in selected class
      service.selectCompetitors( results.classes[ 1 ].competitors[ 1 ], results.classes[ 1 ].competitors[ 0 ] );

      // Select class and see if competitors change.. There should be no change.
      service.selectClass( results.classes[ 1 ] );

      // deselect competitorno currently selected - no change expected
      service.deselectCompetitors( results.classes[ 0 ].competitors[ 0 ] );

      // deselect competitor not curretly seleced
      service.deselectCompetitors( results.classes[ 1 ].competitors[ 0 ], results.classes[ 0 ].competitors[ 1 ] );


   } );
} );

