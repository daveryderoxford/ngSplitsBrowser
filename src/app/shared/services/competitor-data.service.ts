import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { CompetitorSearchData, OEvent } from '../../model';
import { Competitor } from 'app/results/model';

@Injectable({
  providedIn: 'root'
})
export class CompetitorDataService {

  constructor(private afs: AngularFirestore) { }

  /** Save the competitor search recored
   * EventKey and cardID are unique
  */
  public createNew(event: OEvent, comp: Competitor): CompetitorSearchData {
    return {
      eventKey: event.key,
      ecardId: comp.ecardId,
      first: comp.firstname,
      surname: comp.surname,
      club: comp.club,
    };
  }

  /** Search for result where name matches
   *  matches if surname + firstname + club matches
  */
  searchResultsByName(firstname: string, surname: string, club: string): Promise<CompetitorSearchData[]> {
    const query = this.afs.collection<CompetitorSearchData>("/results", ref => {
      return ref.where("surname", "==", surname)
        .where("club", "==", club)
        .where("firstname" , "==", firstname);
    }).valueChanges().take(1);

    return query.toPromise();
  }

  /** Search for results where any ecard matches */
  searchResultsByECard(ecardId: string): Promise<CompetitorSearchData[]> {
    // Search each of the users ecard numbers defined in ecard object
      const query = this.afs.collection<CompetitorSearchData>("/results", ref => {
        return ref.where("ecard", "==", ecardId)
          .orderBy('date', 'desc');
      }).valueChanges().take(1);

      return query.toPromise();
  }
}

