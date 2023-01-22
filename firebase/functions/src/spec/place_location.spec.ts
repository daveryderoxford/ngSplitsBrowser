/**  */
import { expect } from 'chai';
import 'mocha';
import { convertPlace } from '../fixtures/place_location';


describe( 'Convert place names to geographic coodrinated using Google Maps geoConvert  ', () => {

   it( 'Return the geographic coordinate of known place names', async () => {

      const results = await convertPlace( 'Brentwood', null) ;
      expect( results ).to.deep.equal( { lat: 0, long: 0 } );

   } );

   it( 'Return undefined if place is not known ', async () => {

   } );

} );
