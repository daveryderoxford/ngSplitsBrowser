import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { UserData, UserInfo } from "app/model";
import firebase from "firebase/compat/app";
import { Observable, of } from 'rxjs';
import { shareReplay, startWith, switchMap } from 'rxjs/operators';

@Injectable( {
  providedIn: "root"
} )
export class UserDataService {

  public user$: Observable<UserData | null>;

  private currentUser: UserData | null = null;
  private uid: string;

  constructor (
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) {

    this.user$ = this.afAuth.authState.pipe(
      startWith( null ),
      switchMap( ( user: firebase.User ) => {
        console.log()
        if ( !user ) {
          console.log( "UserData: Firebase user null.  Stop monitoring user date  " );
          return of( null );
        } else {
          console.log( `UserData: monitoring uid: ${user.uid}` );
          return this._doc( user.uid ).valueChanges();
        }
      } ),
      shareReplay(1)
    );

    /* Subscribe to update local cache - remove at some point */
    this.user$.subscribe( user => {
      if ( !user ) {
        console.log( "UserData: Local cache updated to nll " );
        this.currentUser = null;
        this.uid = null;
      } else {
        console.log( "UserData: Local cache updated to new value " );
        this.currentUser = user;
        this.uid = user.key;
      }
    } );

  }

  /** Get current user data  */
  get currentUserData(): UserData {
    return this.currentUser;
  }

  /** Update the user info.  Returning the modified user details */
  async updateDetails( details: Partial<UserInfo> ): Promise<void> {
    return this._getUserDoc().update( details )
  }

  private _doc( uid: string ) {
    return this.afs.doc<UserData>( "users/" + uid );
  }

  /** Get the database documents associated with the user
   * The user must be logged in to use this function.
   */
  private _getUserDoc(): AngularFirestoreDocument<UserData> {
    const userDoc = this.afs.doc<UserData>( "users/" + this.uid );
    return userDoc;
  }

  /** Reserve a map for the user */
  async addFixtureReminder( eventId: string ): Promise<void> {
    await this._getUserDoc().update( {
      reminders: firebase.firestore.FieldValue.arrayUnion( eventId ) as any
    } );
  }

  async removeFixtureReminder( eventId: string ): Promise<void> {
    await this._getUserDoc().update( {
      reminders: firebase.firestore.FieldValue.arrayRemove( eventId ) as any
    } );
  }
}
