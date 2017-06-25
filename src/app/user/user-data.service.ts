import { Injectable } from '@angular/core';
import { ExtUserData } from 'app/model/user';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

@Injectable()
export class UserDataService {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase) { }

  getUser(): FirebaseObjectObservable<ExtUserData> {

    const obs = this.db.object(this.getPath());

    // if user does  does not exist create a user object
    obs.subscribe((userData) => {
      if (!userData.$exists()) {
        this.createUser();
      }
    });

    return (obs);

  }

  async updateDetails(details): Promise<any> {
    await this.getRef().update(details);
  }

  private createUser() {
    const user = {
     // $key: this.afAuth.auth.currentUser.uid,
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
    return ('users/' + uid)

  }

  private getRef() {
    return (this.db.database.ref(this.getPath()));
  }

}
