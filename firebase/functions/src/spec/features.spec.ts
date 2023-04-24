import { expect, spy, use } from 'chai';
// import { spies } from 'chai-spies';
import 'mocha';
import { Fixture } from "model/fixture";
import { Fixtures } from '../fixtures/fixtures';
import { smalltestBOFPDAFile } from './BOFPDATestData.spec';
import * as admin from "firebase-admin";


const spies = require( 'chai-spies' );

const expectedFixtures: Fixture[] = [
   {
      id: "72446",
      date: "2019-03-24T00:00:00.000Z",
      name: "SROC Red Rose Classic",
      grade: "National",
      clubURL: "http://www.sroc.org",
      club: "SROC",
      association: "NWOA",
      latLong: { lat: 54.216616169229894, lng: -2.9323406028649956 },  // SD393805
      postcode: "LA11 6HL",
      area: "Hampsfell",
      nearestTown: "Grange over Sands",
      type: "Foot",
      approxlocation: false
   },
   {
      id: "76012",
      date: "2019-03-28T00:00:00.000Z",
      name: "Spring series 4, Whitehaven",
      grade: "Club",
      clubURL: "http://www.wcoc.co.uk",
      club: "WCOC",
      association: "NWOA",
      area: "",
      nearestTown: "Whitehaven",
      postcode: "",
      latLong: null,
      type: "Foot",
      approxlocation: false
   },
   {
      id: "activity-26377",
      date: "2019-03-30T00:00:00.000Z",
      name: "Postcode",
      grade: "Local",
      clubURL: "http://www.quantockorienteers.co.uk",
      club: "QO",
      association: "SWOA",
      postcode: "TA1 2RH",
      latLong: { lat: 51.010333, lng: -3.073797 },
      area: "Blackbrook and Holway",
      nearestTown: "Taunton",
      type: "Foot",
      approxlocation: false
   }
];

describe( 'Fxtures', () => {

   use( spies );

   it( 'should should process known BOF data correctly', async () => {

      const fixtures = new Fixtures(admin.storage());

      const spyLoadBOF = spy.on( fixtures, 'loadBOFPDA', returns => Promise.resolve( smalltestBOFPDAFile ) );

      const spySave = spy.on( fixtures, 'saveToStorage', ( fix: Fixture[] ) => {
         expect( fix ).to.deep.equal( expectedFixtures );
         return Promise.resolve( smalltestBOFPDAFile );
      } );

      await fixtures.processFixtures();

      expect( spyLoadBOF ).to.have.been.called();

   } );


   xit( 'should should process data from live BOF feed', async () => {

      const fixtures = new Fixtures(admin.storage());

      const spySave = spy.on( fixtures, 'saveToStorage', returns => Promise.resolve() );

      await fixtures.processFixtures();

      // Perform your test

      expect( spySave ).to.have.been.called();

   } );
} );


