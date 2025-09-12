import { Injectable, inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { FirebaseApp } from '@angular/fire/app';
import { Auth, User } from "@angular/fire/auth";
import { DocumentReference, doc, docData, getFirestore, setDoc } from "@angular/fire/firestore";
import { AuthService } from 'app/auth/auth.service';
import { mappedCollectionRef } from 'app/shared/utils/firestore-helper';
import { of } from 'rxjs';
import { UserData } from './user';

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
    if (this.user()) {
      const key = this.user()!.key;
      console.log('UserDataService: Saving user' + key);
      details.key = key;
      return setDoc(this._doc(key), details, {merge: true});
    } else {
      console.log('UserDataService: Saving user: Unexpectly null');
      throw Error('UserDataService: Saving user: Unexpectly null');
    }
  }

  private _doc(uid: string): DocumentReference<UserData> {
    return doc(this.userCollection, uid)
  }

}
