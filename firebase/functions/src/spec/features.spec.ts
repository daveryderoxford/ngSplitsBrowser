
import { expect } from 'chai';
import 'mocha';
import { Fixtures } from '../fixtures/fixtures';
import { Location, LatLong, PostCodeLookup } from '../fixtures/postcode';

const expectedLocations: Location[] = [
   {
      "postcode": "TW18 2AB",
      "longitude": -0.508227,
      "latitude": 51.43116,
      "eastings": 503801,
      "northings": 171295
   },
   {
      "postcode": "CM15 8BN",
      "longitude": 0.31313,
      "latitude": 51.617483,
      "eastings": 560239,
      "northings": 193496
   }
];

describe( 'Fixutes from actual bof', () => {

   it( 'should should process the docuemtn without error', async () => {

      const fixtures = new Fixtures();


      const results = await fixtures.processFixtures(  );

      // Read docuemnt from google

   } );

   it( 'should convert document correctly mocking bof fixtures and google', async () => {
      const lookup = new PostCodeLookup();

      const latlongs: LatLong[] = [
         {
            latitude: 51.43116,
            longitude: -0.508227,
         },
         {
            latitude: 51.617483,
            longitude: 0.31313,
         }
      ];

      const results = await lookup.gridRefToPostcode( latlongs );

      expect( results.length ).to.equal( 2 );

      expect( results ).to.deep.equal( expectedLocations );
   } );

} );

