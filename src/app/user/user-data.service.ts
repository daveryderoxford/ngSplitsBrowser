import { Injectable, inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Auth, User } from "@angular/fire/auth";
import { DocumentReference, doc, docData, getFirestore, updateDoc } from "@angular/fire/firestore";
import { AuthService } from 'app/auth/auth.service';
import { of } from 'rxjs';
import { UserData } from './user';
import { FirebaseApp } from '@angular/fire/app';

@Injectable({
  providedIn: "root"
})
export class UserDataService {
  private auth = inject(Auth);
  private fs = getFirestore(inject(FirebaseApp));
  private as = inject(AuthService);

  private _userResource = rxResource<UserData, User>({
    params: () => this.as.user(),
    stream: request => request.params ? docData(this._doc(request.params.uid)) : of(undefined)
  });

  readonly user = this._userResource.value.asReadonly();

  /** Update the user info.  */
  async updateDetails(details: Partial<UserData>): Promise<void> {
    if (this.user()) {
      console.log('UserDataService: Saving user' + this.user()!.key);
      details.key = this.user()!.key;
      const doc = this._doc(this.user()!.key);
      return updateDoc(doc, details);
    } else {
      console.log('UserDataService: Saving user: Unexpectly null');
      throw Error('UserDataService: Saving user: Unexpectly null');
    }
  }

  private _doc(uid: string): DocumentReference<UserData> {
    return doc(this.fs, "users/" + uid) as DocumentReference<UserData>;
  }

}
