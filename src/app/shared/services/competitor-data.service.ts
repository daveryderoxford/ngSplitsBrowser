import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Competitor } from '../../results/model';
import { OEvent, CompetitorSearchData } from '../../model';
import { Observable } from 'rxjs/Observable';
import { Utils } from '..';
import { ECard } from '../../model/user';

@Injectable({
  providedIn: 'root'
})
export class CompetitorDataService {

  constructor(private afs: AngularFirestore) { }

  /** Save the competitor search recored */
  public createNew(event: OEvent, comp: Competitor): CompetitorSearchData {
    return {
      key: event.key + '-' + comp.key,
      eventKey: event.key,
      ecardId: comp.ecardId,
      first: comp.firstname,
      surname: comp.surname,
      club: comp.club,
    };
  }

  /** Search for result where name matches
   *  matches if surname + club match or surname + firstname match
  */
  searchResultsByName(firstname: string, surname: string, club: string): Observable<CompetitorSearchData[]> {
    const query1 = this.afs.collection<CompetitorSearchData>("/results", ref => {
      return ref.where("surname", "==", surname)
        .where("club", "==", club);
    }).valueChanges().take(1);

    const query2 = this.afs.collection<CompetitorSearchData>("/results", ref => {
      return ref.where("surname", "==", surname)
        .where("club", "==", firstname);
    }).valueChanges().take(1);

    // Merge results of the two queries and remove duplicates
    const zipped = Observable.zip(query1, query2).map(([res1, res2]) => {
      return Utils.removeDuplicates(res1.concat(res2));
    });

    return zipped;
  }

  /** Search for results where any ecard matches */
  searchResultsByECard(ecards: Array<ECard>, eventsAfter: Date): Observable<CompetitorSearchData[]> {
    // Search each of the users ecard numbers defined in ecard object
    const querys: Array<Observable<CompetitorSearchData[]>> = [];

    for (const card of ecards) {
      const query = this.afs.collection<CompetitorSearchData>("/results", ref => {
        return ref.where("ecard", "==", card.id)
          .orderBy('date', 'desc');
      }).valueChanges().take(1);

      querys.push(query);
    }

    const zipped = Observable.zip(querys).map(allQueryResults => {
      // concaternate the queries and remove duplicates
      let results: CompetitorSearchData[] = [];
      for (const qresults of allQueryResults) {
        results = results.concat(qresults);
      }
      return Utils.removeDuplicates(results);
    });
    return zipped;
  }
}

