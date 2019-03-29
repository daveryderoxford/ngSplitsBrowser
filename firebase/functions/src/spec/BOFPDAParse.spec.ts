/**  */
import { expect } from 'chai';
import 'mocha';
import { BOFPDParseData, BOFPDParser } from '../fixtures/bof_pda_parse';
import { testBOFPDAFile } from './BOFPDATestData.spec';

describe( 'Parse BOF PDA URL', () => {

   it( 'should parse example file', () => {

      const parser = new BOFPDParser();

      const bofFixtures: BOFPDParseData[] = parser.parseBOFPDAFile( testBOFPDAFile );

      // Row with grid reference
      expect( bofFixtures.length ).to.equal( 1267 );
      expect( bofFixtures[ 0 ].date ).to.equal( '2019-03-24T00:00:00.000Z');
      expect( bofFixtures[ 0 ].id ).to.equal( '72446' );
      expect( bofFixtures[ 0 ].name ).to.equal( 'SROC Red Rose Classic' );

      expect( bofFixtures[ 0 ].BOFLink ).to.equal( 'index.php?pg=event&amp;event=72446&bpg=' );

      expect( bofFixtures[ 0 ].club ).to.equal( 'SROC' );
      expect( bofFixtures[ 0 ].clubURL ).to.equal( 'http://www.sroc.org' );

      expect( bofFixtures[ 0 ].postcode ).to.equal( '');  // Grid reference in colunm  Not a postcode
      expect( bofFixtures[ 0 ].region ).to.equal( 'NWOA' );
      expect( bofFixtures[ 0 ].grade ).to.equal( 'National' );

      expect( bofFixtures[ 0 ].eventLocation ).to.equal( 'Hampsfell' );
      expect( bofFixtures[ 0 ].nearestTown ).to.equal( 'Grange over Sands' );
      expect( bofFixtures[ 0 ].gridRefStr ).to.equal( 'SD393805' );


      // Row without any postcode or grid ref  (Spring series 4, Whitehaven)
      expect( bofFixtures[ 1 ].name ).to.equal( 'Spring series 4, Whitehaven' );
      expect( bofFixtures[ 1 ].postcode ).to.equal( '');
      expect( bofFixtures[ 1 ].gridRefStr ).to.equal( '' );

      // Row with postcode  (Postcode)
      expect( bofFixtures[ 2 ].name ).to.equal( 'Postcode' );
      expect( bofFixtures[ 2].postcode ).to.equal( 'TA1 2RH' );
      expect( bofFixtures[ 2 ].gridRefStr ).to.equal( '' );

     // Last row (WOC 2022 Public Races)
      expect( bofFixtures[ 1266 ].date ).to.equal( '2022-07-13T00:00:00.000Z' );
      expect( bofFixtures[ 1266 ].name ).to.equal( 'WOC 2022 Public Races' );

   } );

} );

