import { TestBed } from '@angular/core/testing';
import { OEvent } from 'app/model';
import { Competitor } from 'app/results/model';
import { CompetitorDataService } from './competitor-data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

class AngularFirestoreStub {

}

function checkCompSearchData(searchData, key, eventkey, ecardId, first, surname, club, added) {
  expect(searchData.key).toEqual(key);
  expect(searchData.eventKey).toEqual(eventkey);
  expect(searchData.ecardId).toEqual(ecardId);
  expect(searchData.first).toEqual(first);
  expect(searchData.surname).toEqual(surname);
  expect(searchData.club).toEqual(club);
  expect(searchData.added).toEqual(added);
}

let cds: CompetitorDataService;

xdescribe('CompetitorDataService', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        CompetitorDataService, { provide: AngularFirestore, useValue: AngularFirestoreStub }
      ]
    });
    cds = TestBed.get(CompetitorDataService);
  });

  it('should be created', () => {
    expect(cds).toBeTruthy();
  });

  it('should create competitors search data', () => {

    const oevent: OEvent = {
      key: "abcd",
      userId: 'AUserId',
      yearIndex: 2018,    // Used for filtering
      gradeIndex: {},
      name: 'Test Event1',
      nationality: 'GBR',
      date: '2018-11-21',
      club: 'SN',
      grade: 'Regional',
      type: 'Foot',
      discipline: 'Long',
      webpage: 'http://www.test/co/uk',
      email: 'fred@splitsbrowser.org.uk',
      controlCardType: 'SI',
    };

    const cumTimes = [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100];
    const competitor = Competitor.fromCumTimes(1, "John Smith", "ABC", 10 * 3600, cumTimes);
    const date = new Date('2018-03-04');

    const searchData = cds.createNew(oevent, competitor, date);

    checkCompSearchData(searchData,
      oevent.key + '-' + competitor.key,
      oevent.key,
      competitor.ecardId,
      competitor.firstname,
      competitor.surname,
      competitor.club,
      date);

  });

  it('should find user results if a match occurs', async (done) => {
    const ecardId44 = '123456';
    const results = await cds.searchResultsByECard(ecardId44);
    expect(results.length).toEqual(1);
    done();
  });

  it('should not find user results if a match occurs', async (done) => {
    const ecardIdA = '123456';
    const results = await cds.searchResultsByECard(ecardIdA);
    expect(results.length).toEqual(0);
    done();
  });

  it('should only include results after specified date', async (done) => {
    const ecardIdA = '123456';
    const date = new Date('2018-10-10');
    const results = await cds.searchResultsByECard(ecardIdA, date);
    done();
  });
});
