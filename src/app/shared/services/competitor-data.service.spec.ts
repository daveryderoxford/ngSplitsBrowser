import { inject, TestBed } from '@angular/core/testing';
import { OEvent, CompetitorSearchData } from 'app/model';
import { Competitor } from 'app/results/model';
import { CompetitorDataService } from './competitor-data.service';
import { AngularFirestore } from '@angular/fire/firestore';

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

describe('CompetitorDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompetitorDataService, { provide: AngularFirestore, useValue: AngularFirestoreStub }
      ]
    });
  });

  it('should be created', inject([CompetitorDataService], (cds: CompetitorDataService) => {
    expect(cds).toBeTruthy();
  }));

  it('should create competitors search data', inject([CompetitorDataService], (cds: CompetitorDataService) => {

    const oevent: OEvent = {
      key: "abcd",
      user: 'AUserId',
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

  }));

  it('should find user results if a match occurs', inject([CompetitorDataService], async (service: CompetitorDataService) => {

    const ecardId44 = '123456';
    const results: CompetitorSearchData[] = await service.searchResultsByECard(ecardId44);
    expect(results.length).toBe(1);
  }));

  it('should not find user results if a match occurs', inject([CompetitorDataService], async (service: CompetitorDataService) => {
    const ecardIdA = '123456';
    const result = await service.searchResultsByECard(ecardIdA);
  }));

  it('should only include results after specified date', inject([CompetitorDataService], async (service: CompetitorDataService) => {
    const ecardIdA = '123456';
    const date = new Date('2018-10-10');
    const result = await service.searchResultsByECard(ecardIdA, date);
  }));
});
