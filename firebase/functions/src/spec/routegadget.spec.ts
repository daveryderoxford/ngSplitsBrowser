import { expect } from 'chai';
import 'mocha';
import { Routegadget } from '../fixtures/routegadget';
import { RGSITES } from '../fixtures/routegadgetclubs';

const sn = {
   "name": "Southern Navigators",
   "shortName": "sn",
   "rgUKPrifix": "",
   "isNonStandard": null,
   "baseURL": "https://www.sn.routegadget.co.uk/",
   "notes": ""
};

const int = {
   "name": "Interlopers",
   "shortName": "int",
   "rgUKPrifix": "interlopers",
   "isNonStandard": null,
   "baseURL": "https://www.interlopers.routegadget.co.uk/",
   "notes": ""
};

describe.only( 'Routegaedget', () => {

   it( 'should read routegadget events for specified clubs', async () => {

      const gr = new Routegadget();

      await gr.initialise();

      /*  console.log( "=== Clubs Map details ====" );
        for ( const [key, events] of gr.clubs ) {
           console.log( key + "  Event count: " + events.length );
        } */

      expect( gr.rgSitesMap.size ).to.equal( RGSITES.length );

      const ret = gr.getRoutegadgetData( 'xxx', 'SN' );
      expect( ret.baseURL ).to.equal( sn.baseURL );

   } ).timeout( 20000 );

   it( 'should return null if event does not exist in routegagdte', async () => {
      const gr = new Routegadget();

      await gr.initialise( [sn] );


   });

   it( 'should read clubs events for routegadget', async () => {

      const gr = new Routegadget();

      await gr.initialise( [sn] );

      const ret = gr.getRoutegadgetData( 'Merrist', 'XXX' );

      expect( ret).to.equal(null);
   } );


   it( 'should load events for a specified area', async () => {

      const gr = new Routegadget();

      await gr.initialise( [sn] );

      const ret = gr.getRoutegadgetData( 'Merrist', 'SN' );

      expect( ret.baseURL ).to.equal( sn.baseURL );
      expect( ret.maps.length ).to.equal( 4 );
      expect( ret.maps[0] ).to.deep.equal( { id: 26, name: "Saturday Series - Merrist Wood", mapfile: "26.jpg"} );

   } );

   it( 'search should be case insensitive', async () => {

      const gr = new Routegadget();

      await gr.initialise( [sn] );

      const ret = gr.getRoutegadgetData( 'mErrist', 'SN' );

      expect( ret.maps.length ).to.equal( 4 );
      expect( ret.maps[0] ).to.deep.equal( { id: 26, name: "Saturday Series - Merrist Wood", mapfile: "26.jpg" } );

   } );

   it( 'When finding events for area should ignore common keywords', async () => {

      const gr = new Routegadget();
      let ret;

      await gr.initialise( [sn] );

      // Ignore common keywords
      //Note: the whole area string will still match so we specify multipe skipped words
      expect( gr.getRoutegadgetData( 'Common Woods', 'SN' ).maps.length ).to.equal( 0 );
      expect( gr.getRoutegadgetData( 'woods and', 'SN' ).maps.length ).to.equal( 0 );

      // Southwood is found and country, part are ignored
      ret = gr.getRoutegadgetData( 'Southwood Country Park', 'SN' )
      expect( ret.maps.length ).to.equal( 2 );
      expect( ret.maps[1] ).to.deep.equal( { id: 156, name: 'Southwood Country Park', mapfile: "154.gif" } );

      // Two letter word is ignored.  
      expect( gr.getRoutegadgetData( 'Common st', 'SN' ).maps.length ).to.equal( 0 );
   } );

   it( 'and should be excluded (Interlopers test)', async () => {

      const gr = new Routegadget();

      await gr.initialise( [int] );

      const ret = gr.getRoutegadgetData( "Holyrood and Craigmillar", 'INT' );

      //  5 events expected for interlopers containg Craigmillar
      expect( ret.maps.length ).to.equal( 5 );

   } );

   it( 'Two valid words returns events for both areas', async () => {

      const gr = new Routegadget();

      await gr.initialise( [sn] );

      const ret = gr.getRoutegadgetData( 'Merrist Wisley', 'SN' );

      //  11 events for both wisley and merrist
      expect( ret.maps.length ).to.equal( 11 );

   } );

} );
