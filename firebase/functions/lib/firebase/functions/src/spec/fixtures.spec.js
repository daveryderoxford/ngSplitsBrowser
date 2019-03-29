"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**  */
var chai_1 = require("chai");
require("mocha");
var fixtures_1 = require("../fixtures");
var fixturetestdata_spec_1 = require("./fixturetestdata.spec");
describe('Parse BOF PDA URL', function () {
    it('should parse example file', function () {
        var bofFixtures = fixtures_1.parseBOFPDAFile(fixturetestdata_spec_1.testBOFPDAFile);
        chai_1.expect(bofFixtures.length).to.equal(555);
        // expect( bofFixtures[ 0 ].date ).to.equal( 72446 );
        chai_1.expect(bofFixtures[0].id).to.equal(72446);
        chai_1.expect(bofFixtures[0].name).to.equal('SROC Red Rose Classic');
        chai_1.expect(bofFixtures[0].BOFLink).to.equal('index.php?pg=event&amp;amp;event=72446&amp;bpg=');
        chai_1.expect(bofFixtures[0].club).to.equal('SROC');
        chai_1.expect(bofFixtures[0].clubURL).to.equal('http://www.sroc.org');
        chai_1.expect(bofFixtures[0].postcode).to.equal('SD393805');
        chai_1.expect(bofFixtures[0].region).to.equal('NWOA');
        chai_1.expect(bofFixtures[0].grade).to.equal('National');
        chai_1.expect(bofFixtures[0].eventLocation).to.equal('Hampsfell');
        chai_1.expect(bofFixtures[0].nearestTown).to.equal('Grange over Sands');
    });
});
//# sourceMappingURL=fixtures.spec.js.map