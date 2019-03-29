
import { expect } from 'chai';
import 'mocha';
import { PostCodeLookup, Location, LatLong } from '../fixtures/postcode';

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

describe( 'Postcode conversion', () => {

   it( 'should convert postcodes to location', async () => {

      const lookup = new PostCodeLookup();

      const postcodes = [ "TW182AB", "CM158BN" ];

      const results = await lookup.postcodeToLocation( postcodes );

      expect( results.length ).to.equal( 2 );

      expect( results ).to.deep.equal( expectedLocations );

   } );

   it( 'should convert grid reference to postcode', async () => {
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

      console.log( JSON.stringify( results ) );

      expect( results.length ).to.equal( 2 );

      expect( results ).to.deep.equal( expectedLocations );
   } );

} );

