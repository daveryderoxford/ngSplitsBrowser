import { expect } from 'chai';
import { spies } from 'chai-spies';
import 'mocha';
import { Fixtures } from '../fixtures/fixtures';
import { smalltestBOFPDAFile } from './BOFPDATestData.spec';

const expectedFixtures: Feature[] = [
   {},
   {}
];

describe( '', () => {

   chai.use(spies);

   it( 'should should process known BOF data correctly', async () => {

      const fixtures = new Fixtures();

      const spySave = chai.spy.on(fixtures, 'saveToStorage', returns => Promise.resolve());
      const spyLoadBOF = chai.spy.on(fixtures, 'loadBOFPDA', returns => Promise.resolve(smalltestBOFPDAFile));

      await fixtures.processFixtures();

      expect(spyLoadBOF).to.have.been.called();
      expect(spySave).to.have.been.called().with(expectedFixtures);

   } );

   it( 'should should process data from live BOF feed', async () => {

      const fixtures = new Fixtures();

      const spySave = chai.spy.on(fixtures, 'saveToStorage', returns => Promise.resolve());

      await fixtures.processFixtures();

      // Perform your test
   
      expect(spySave).to.have.been.called();

   });

} );

