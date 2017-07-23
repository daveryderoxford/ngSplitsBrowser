import { Injectable } from '@angular/core';
import { FullUserData, UserResultData } from 'app/model/user';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { EventInfo } from "app/model/oevent";

@Injectable()
export class UserDataService {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase) { }

    /** Get a reference to use data for a user creating it if it does not exist */
  getUser(): FirebaseObjectObservable<FullUserData> {

    const obs = this.db.object(this.getPath());

    // if user does  does not exist create a user object
    obs.subscribe((userData) => {
      if (!userData.$exists()) {
        this.createUser();
      }
    });

    return (obs);

  }

  /** Saves  */
  async updateDetails(details: EventInfo): Promise<any> {
    await this.getRef().update(details);
  }

  private createUser() {
    const user = {
      firstName: '',
      lastName: '',
      club: '',
      nationality: '',
      nationalId: '',
      yearOfBirth: '',
      ecardEmit: '',
      ecardSI: '',
      autoFind: '',
      events: []
    }
    this.getRef().set(user);
  }

  private getPath(): string {
    const uid = this.afAuth.auth.currentUser.uid;
    return ('users/' + uid);
  }

  private getRef() {
    return (this.db.database.ref(this.getPath()));
  }

   /** Add a result for the currently signed in user  */
  async addResult(result: UserResultData): Promise<any> {

      // Add event in date order.


  }

  async removeResult(result: UserResultData): Promise<any> {

  }

}
