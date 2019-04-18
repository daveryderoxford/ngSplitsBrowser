
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

      const results = await lookup.postcodeToLocation( postcodes );

      expect( results.length ).to.equal( 2 );

      expect( results ).to.deep.equal( locations );

   } );

   it( 'should convert lat long to postcode', async () => {

      const results = await lookup.latLongToPostcode( locations );

      expect( results.length ).to.equal( 2 );
      expect( results ).to.deep.equal( postcodes );

      expect( results[ 0 ] ).to.equal( "TW18 2AB" );
      expect( results[ 1 ] ).to.equal( "CM15 8BN" );

   } );

   it( 'should handle large request Postcode request (over 100)', async () => {
      const largePostcodes = Array<string>( 201 ).fill( postcodes[0] );
      largePostcodes.push( postcodes[ 1 ]);

      const results = await lookup.postcodeToLocation( largePostcodes );

      expect( results.length).to.equal(202);

      expect( results[ 101 ] ).to.deep.equal( locations[ 0 ]);
      expect( results[ 200 ] ).to.deep.equal( locations[0] );
      expect( results[ 201 ] ).to.deep.equal( locations[1] );

   } );

   it( 'should handle large request lat long request (over 100)', async () => {
      const largeLocations = Array<LatLong>( 201 ).fill( locations[ 0 ] );
      largeLocations.push( locations[ 1 ] );

      const results = await lookup.latLongToPostcode( largeLocations );

      expect( results.length ).to.equal( 202 );

      expect( results[ 101 ] ).to.equal( postcodes[ 0 ] );
      expect( results[ 200 ] ).to.equal( postcodes[ 0 ] );
      expect( results[ 201 ] ).to.equal( postcodes[ 1 ] );

   } ).timeout( 10000 );

   it( 'should return null lat long if postcode is not found', async () => {

      const p = [ "XX18 2XX", "CM15 8BN" ];
      const results = await lookup.postcodeToLocation( p );

      expect( results.length ).to.equal( 2 );
      expect( results[ 0 ] ).to.equal( null );

   } );

   it( 'should return empty string if postcode is not found', async () => {

      const l = [ { "lat": 20.0, "lng": -0.508227 } ]; // lat of 20 outside uk

      const results = await lookup.latLongToPostcode( l );

      expect( results.length ).to.equal( 1 );
      expect( results[ 0 ] ).to.equal( "" );

   } );

} ).timeout( 10000 );


