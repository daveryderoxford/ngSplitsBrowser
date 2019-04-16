import { expect, use, spy } from 'chai';
// import { spies } from 'chai-spies';
import 'mocha';
import { Fixture, LatLong } from "../../../../src/app/model/fixture";
import { smalltestBOFPDAFile } from './BOFPDATestData.spec';
import { Fixtures } from '../fixtures/fixtures';

const spies = require( 'chai-spies' );

const expectedFixtures: Fixture[] = [
   {
      id: "72446",
      date: "24-03-2019T00:00:00.000Z",
      name: "SROC Red Rose Classic",
      grade: "National",
      clubURL: "http://www.sroc.org",
      club: "SROC",
      association: "NWOA",
      latLong: { lat: 54.21636, lng: -2.932341 },  // SD393805
      postcode: "LA11 6HL",
      area: "Hampsfell",
      nearestTown: "Grange over Sands",
   },
   {
      id: "6012",
      date: "28-03-2019T00:00:00.000Z",
      name: "Spring series 4, Whitehaven",
      grade: "Club",
      clubURL: "http://www.wcoc.co.uk",
      club: "WCOC",
      association: "NWOA",
      area: "",
      nearestTown: "Whitehaven",
      postcode: "",
      latLong: null
   },
   {
      id: "activity-26377",
      date: "30-03-2019T00:00:00.000Z",
      name: "Postcode",
      grade: "Local",
      clubURL: "http://www.quantockorienteers.co.uk",
      club: "QO",
      association: "SWOA",
      postcode: "TA1 2RH",
      latLong: { lat: 51.010333, lng: -3.073797 },
      area: "Blackbrook and Holway",
      nearestTown: "Taunton"
   }
];

describe( 'Fxtures', () => {

   use( spies );

   it( 'should should process known BOF data correctly', async () => {

      const fixtures = new Fixtures();

      const spySave = spy.on( fixtures, 'saveToStorage', returns => Promise.resolve() );
      const spyLoadBOF = spy.on( fixtures, 'loadBOFPDA', returns => Promise.resolve( smalltestBOFPDAFile ) );

      await fixtures.processFixtures();

      expect( spyLoadBOF ).to.have.been.called();
      //  expect(spySave).to.have.been.called().with.Arguments.deep([expectedFixtures]);

   } );

   it( 'should should process data from live BOF feed', async () => {

      const fixtures = new Fixtures();

      const spySave = spy.on( fixtures, 'saveToStorage', returns => Promise.resolve() );

      await fixtures.processFixtures();

      // Perform your test

      expect( spySave ).to.have.been.called();

   } );

} );


