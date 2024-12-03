import { inject, Injectable } from "@angular/core";
import { Auth, authState } from '@angular/fire/auth';
import { doc, docData, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import { UserData, UserInfo } from 'app/user/user';
import { ResultsDataService } from 'app/results/results-data.service ';
import { Observable, of } from 'rxjs';
import { shareReplay, startWith, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class UserDataService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private rd = inject(ResultsDataService);

  public user$: Observable<UserData | null>;

  private currentUser: UserData | null = null;
  private uid: string;

  constructor() {

    this.user$ = authState(this.auth).pipe(
      startWith(null),
      switchMap((user) => {
        console.log();
        if (!user) {
          console.log("UserData: Firebase user null.  Stop monitoring user date  ");
          return of(null);
        } else {
          console.log(`UserData: monitoring uid: ${user.uid}`);
          const d = doc(this.firestore, user.uid) as DocumentReference<UserData>;
          return docData(d);
        }
      }),
      shareReplay(1)
    );

    /* Subscribe to update local cache - remove at some point */
    this.user$.subscribe(user => {
      if (!user) {
        console.log("UserData: Local cache updated to nll ");
        this.currentUser = null;
        this.uid = null;
      } else {
        console.log("UserData: Local cache updated to new value ");
        this.currentUser = user;
        this.uid = user.key;
      }
    });
  }

  /** Get current user data  */
  get currentUserData(): UserData {
    return this.currentUser;
  }

  /** Update the user info.  Returning the modified user details */
  async updateDetails(details: Partial<UserInfo>): Promise<void> {
    return updateDoc(this._getUserDoc(), details);
  }

  private _doc(uid: string): DocumentReference<UserData> {
    return doc(this.firestore, "users/" + uid) as DocumentReference<UserData>;
  }

  /** Get the database documents associated with the user
   * The user must be logged in to use this function.
   */
  private _getUserDoc(): DocumentReference<UserData> {

    const userDoc = doc(this.firestore, "users/" + this.uid) as DocumentReference<UserData>;
    return userDoc;
  }

}
