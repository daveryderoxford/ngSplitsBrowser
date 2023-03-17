import { expect } from 'chai';
import 'mocha';
import { Routegadget } from '../fixtures/routegadget';


describe.only( 'Routegaedget', () => {

   it( 'should read routegadget events for specified clubs', async () => {

      const gr = new Routegadget();

      await gr.initialise();

      expect( gr.clubs.size ).to.equal( 2 );

   } );

   it( 'should read clubs events for routegadget', async () => {

      const gr = new Routegadget();

      await gr.initialise( ['sn'] );

      expect( gr.clubs.size ).to.equal( 1 );

      const c = gr.clubs;

      const events = c.get( 'sn' );

      expect( events.length >= 157 );

   } );

   it( 'should load events for a specified area', async () => {

      const gr = new Routegadget();

      await gr.initialise( ['sn'] );

      const ret = gr.findRoutemadgetMapByName( 'Merrist', 'SN' );

      expect( ret.length ).to.equal( 4 );
      expect( ret[0] ).to.deep.equal( { eventid: 26, mapid: 26, name: "Saturday Series - Merrist Wood", URL: 'https://www.sn.routegadget.co.uk/kartat/26.jpg' } );

   } );

   it( 'search should be case insensitive', async () => {

      const gr = new Routegadget();

      await gr.initialise( ['sn'] );

      const ret = gr.findRoutemadgetMapByName( 'mErrist', 'SN' );

      expect( ret.length ).to.equal( 4 );
      expect( ret[0] ).to.deep.equal( { eventid: 26, mapid: 26, name: "Saturday Series - Merrist Wood", URL: 'https://www.sn.routegadget.co.uk/kartat/26.jpg' } );

   } );

   it( 'When finding events for area should ignore common keywords', async () => {

      const gr = new Routegadget();
      let ret;

      await gr.initialise( ['sn'] );

      // Wood and common words are ignored
      expect( gr.findRoutemadgetMapByName( 'Common', 'SN' ).length).to.equal(0);
      expect( gr.findRoutemadgetMapByName( 'Woods', 'SN' ).length ).to.equal( 0 );

      // Southwood is found and country, part are ignored
      ret = gr.findRoutemadgetMapByName( 'Southwood Country Park', 'SN' )
      expect( ret.length ).to.equal( 2 );
      expect( ret[1] ).to.deep.equal( { eventid: 156, mapid: 154, name: 'Southwood Country Park', URL: 'https://www.sn.routegadget.co.uk/kartat/154.gif'  } );

      // Two letter word is ignored.  
      expect( gr.findRoutemadgetMapByName( 'st', 'SN' ).length ).to.equal( 0 );
   } );

   it( 'Two valid words returns events for both areas', async () => {

      const gr = new Routegadget();

      await gr.initialise( ['sn'] );

      const ret = gr.findRoutemadgetMapByName( 'Merrist Wisley', 'SN' ) ;

      //  11 events for both wisley and merrist
      expect( ret.length ).to.equal( 11 );

   } );

});
