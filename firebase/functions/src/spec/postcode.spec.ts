
import { expect } from 'chai';
import 'mocha';
import { PostCodeLookup, LatLong } from '../fixtures/postcode';


const postcodes = [ "TW18 2AB", "CM15 8BN" ];

const locations: LatLong[] = [
   {
      "lat": 51.43116,
      "lng": -0.508227,
   },
   {
      "lat": 51.617483,
      "lng": 0.31313,
   }
];


describe( 'Postcode IO', () => {
   const lookup = new PostCodeLookup();


   it( 'should convert postcodes to location', async () => {

      console.log(postcodes.toString());

      const results = await lookup.postcodeToLocation( postcodes );

      expect( results.length ).to.equal( 2 );

      expect( results ).to.deep.equal( locations );

   } );

   it( 'should convert lat long to postcode', async () => {

      const results = await lookup.latLongToPostcode( locations );

      expect( results.length ).to.equal( 2 );
      expect(  results[0]).to.equal( "TW18 2AB");
      expect(  results[1]).to.equal( "CM15 8BN");

   } );


   it( 'should handle large request over 100', async () => {

   } );

   it( 'should handle postcode not found', async () => {

      const p = [ "XX18 2XX", "CM15 8BN" ];
      const results = await lookup.postcodeToLocation( p );

      expect( results.length ).to.equal( 2 );
      expect(results[0]).to.equal(null);

   } );

} );

