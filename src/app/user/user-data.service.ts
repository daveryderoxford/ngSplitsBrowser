import { Injectable, inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { FirebaseApp } from '@angular/fire/app';
import { Auth, User } from "@angular/fire/auth";
import { DocumentReference, doc, docData, getFirestore, setDoc, updateDoc, arrayUnion, arrayRemove } from "@angular/fire/firestore";
import { AuthService } from 'app/auth/auth.service';
import { mappedCollectionRef } from 'app/shared/firebase/firestore-helper';
import { of } from 'rxjs';
import { UserData } from './user';
import { UserResult } from '../user-results/user-result';
import { isBefore } from 'date-fns';

@Injectable({
  providedIn: "root"
})
export class UserDataService {
  private auth = inject(Auth);
  private fs = getFirestore(inject(FirebaseApp));
  private as = inject(AuthService);

  private userCollection = mappedCollectionRef<UserData>(this.fs, 'users');

  private _userResource = rxResource<UserData, User>({
    params: () => this.as.user(),
    stream: request => request.params ? docData(this._doc(request.params.uid)) : of(undefined)
  });

  readonly user = this._userResource.value.asReadonly();

  /** Update the user info.  */
  async updateDetails(details: Partial<UserData>): Promise<void> {

    const currentUser = this.user();

    if (!currentUser) {
      console.error('UserDataService: Saving user: Unexpectedly null');
      throw new Error('UserDataService: Saving user: Unexpectedly null');
    }

    const key = currentUser.key;
    console.log('UserDataService: Saving user ' + key);
    details.key = key;
    // Use setDoc with merge=true rahter than update as update does not support withConverter
    await setDoc(this._doc(key), details, { merge: true });
  }

  /** Adds a result to the user's saved results. */
  async addResult(result: UserResult): Promise<void> {
    const user = this.user();
    if (!user) {
      throw new Error('User not logged in. Cannot save result.');
    }

    if (user.results?.some(r => r.key === result.key)) {
      console.log( 'Result already saved, skipping.');
      return
    }

    const updated =  [...user.results, result];
    updated.sort( (a, b) => isBefore(a.event.date, b.event.date) ? -1 : 1 );

    await this.updateDetails( {
      results: updated
    });
  }

  /** Deletes a result from the user's saved results. */
  async deleteResult(result: UserResult): Promise<void> {
    const currentUser = this.user();
    if (!currentUser) {
      throw new Error('User not logged in. Cannot delete result.');
    }
    const userDocRef = this._doc(currentUser.key);
    await updateDoc(userDocRef, {
      results: arrayRemove(result)
    });
  }

  private _doc(uid: string): DocumentReference<UserData> {
    return doc(this.userCollection, uid)
  }

}
