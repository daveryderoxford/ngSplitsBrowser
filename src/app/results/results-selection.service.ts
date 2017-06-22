import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { OEvent } from '../model/oevent'
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';


@Injectable()
export class ResultsSelectionService {

  public event$: BehaviorSubject<OEvent> = new BehaviorSubject(null);
  public event: OEvent = null;

  constructor(private db: AngularFireDatabase,
    private firebaseApp: FirebaseApp,
  ) { }

  setSelectedEvent(event: OEvent) {
    this.event = event;
    this.event$.next(event);
  }

  async setSelectedEventByKey(key: string) {
    if (!this.event || this.event.$key !== key) {
      this.db.object('/events/' + key).subscribe((event) => {
        this.setSelectedEvent(event);
      });
    }
  }

  getEventObservable(): Observable<OEvent> {
    return (this.event$.asObservable());
  }

  /** Returns promise to url of splits file for currently selected event */
  async getSplitsURL(): Promise<any> {
    const path = this.event.splits.splitsFilename;
    return (this.firebaseApp.storage().ref().child(path).getDownloadURL());
  }

}
