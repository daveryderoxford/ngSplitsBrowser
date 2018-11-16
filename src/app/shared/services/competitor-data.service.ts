
import {take} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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
  public createNew(event: OEvent, comp: Competitor, dateAdded: Date): CompetitorSearchData {
    return {
      key: event.key + '-' + comp.key,
      eventKey: event.key,
      ecardId: comp.ecardId,
      first: comp.firstname,
      surname: comp.surname,
      club: comp.club,
      added: dateAdded.toISOString(),
    };
  }

  /** Search for result where name matches
   *  matches if surname + firstname + club matches
  */
  searchResultsByName(firstname: string, surname: string, club: string, start?: Date): Promise<CompetitorSearchData[]> {
    if (!start) {
      start =  new Date(1970, 1, 1);
    }

    const query = this.afs.collection<CompetitorSearchData>("/results", ref => {
      return ref.where("surname", "==", surname)
        .where("club", "==", club)
        .where("firstname" , "==", firstname)
        .orderBy('date', 'desc')
        .where('date', '>', start.toLocaleString());
    }).valueChanges().pipe(take(1));

    return query.toPromise();
  }

  /** Search for results where any ecard matches
   * Note need to check events ecard type after this.
  */
  searchResultsByECard(ecardId: string, start?: Date): Promise<CompetitorSearchData[]> {

    /// Set start date to include all data if no date is provided
    if (!start) {
      start =  new Date(1970, 1, 1);
    }

    // Search each of the users ecard numbers defined in ecard object
      const query = this.afs.collection<CompetitorSearchData>("/results", ref => {
        return ref.where("ecard", "==", ecardId)
          .orderBy('date', 'desc')
          .where('date', '>', start.toDateString());
      }).valueChanges().pipe(take(1));

      return query.pipe(take(1)).toPromise();
  }
}

