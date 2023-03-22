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

describe( 'Routegaedget', () => {

   it( 'should read routegadget events for specified clubs', async () => {

      const gr = new Routegadget();

      await gr.initialise();

      /*  console.log( "=== Clubs Map details ====" );
        for ( const [key, events] of gr.clubs ) {
           console.log( key + "  Event count: " + events.length );
        } */

      expect( gr.rgSitesMap.size ).to.equal( RGSITES.length );

   } ).timeout( 20000 );

   it( 'should read clubs events for routegadget', async () => {

      const gr = new Routegadget();

      await gr.initialise( [sn] );

      expect( gr.rgSitesMap.size ).to.equal( 1 );

      const c = gr.rgSitesMap;

      const events = c.get( 'sn' ).events;

      expect( events.length >= 157 );

   } );

   it( 'should load events for a specified area', async () => {

      const gr = new Routegadget();

      await gr.initialise( [sn] );

      const ret = gr.findRoutemadgetMapByName( 'Merrist', 'SN' );

      expect( ret.length ).to.equal( 4 );
      expect( ret[0] ).to.deep.equal( { eventid: 26, mapid: 26, name: "Saturday Series - Merrist Wood", URL: 'https://www.sn.routegadget.co.uk/kartat/26.jpg' } );

   } );

   it( 'search should be case insensitive', async () => {

      const gr = new Routegadget();

      await gr.initialise( [sn] );

      const ret = gr.findRoutemadgetMapByName( 'mErrist', 'SN' );

      expect( ret.length ).to.equal( 4 );
      expect( ret[0] ).to.deep.equal( { eventid: 26, mapid: 26, name: "Saturday Series - Merrist Wood", URL: 'https://www.sn.routegadget.co.uk/kartat/26.jpg' } );

   } );

   it( 'When finding events for area should ignore common keywords', async () => {

      const gr = new Routegadget();
      let ret;

      await gr.initialise( [sn] );

      // Ignore common keywords
      //Note: the whole area string will still match so we specify multipe skipped words
      expect( gr.findRoutemadgetMapByName( 'Common Woods', 'SN' ).length ).to.equal( 0 );
      expect( gr.findRoutemadgetMapByName( 'woods and', 'SN' ).length ).to.equal( 0 );

      // Southwood is found and country, part are ignored
      ret = gr.findRoutemadgetMapByName( 'Southwood Country Park', 'SN' )
      expect( ret.length ).to.equal( 2 );
      expect( ret[1] ).to.deep.equal( { eventid: 156, mapid: 154, name: 'Southwood Country Park', URL: 'https://www.sn.routegadget.co.uk/kartat/154.gif' } );

      // Two letter word is ignored.  
      expect( gr.findRoutemadgetMapByName( 'Common st', 'SN' ).length ).to.equal( 0 );
   } );

   it.only( 'and should be excluded (Interlopers test)', async () => {

      const gr = new Routegadget();

      await gr.initialise( [int] );

      const ret = gr.findRoutemadgetMapByName( "Holyrood and Craigmillar", 'INT' );

      //  5 events expected for interlopers containg Craigmillar
      expect( ret.length ).to.equal( 5 );

   } );

   it( 'Two valid words returns events for both areas', async () => {

      const gr = new Routegadget();

      await gr.initialise( [sn] );

      const ret = gr.findRoutemadgetMapByName( 'Merrist Wisley', 'SN' );

      //  11 events for both wisley and merrist
      expect( ret.length ).to.equal( 11 );

   } );

} );
