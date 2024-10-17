import { Injectable } from "@angular/core";
import { Auth, authState, User } from '@angular/fire/auth';
import { doc, docData, DocumentReference, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { EventService } from "app/events/event.service";
import { CompetitorSearchData, ECard, OEvent, UserData, UserInfo, UserResult } from "app/model";
import { Competitor, Course, InvalidData, Results } from "app/results/model";
import { ResultsSelectionService } from "app/results/results-selection.service";
import { Observable, of } from 'rxjs';
import { shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';

@Injectable( {
  providedIn: "root"
} )
export class UserDataService {

  public user$: Observable<UserData | null>;

  private currentUser: UserData | null = null;
  private uid: string;

  constructor (
    private auth: Auth,
    private firestore: Firestore,
    private es: EventService,
    private rs: ResultsSelectionService
  ) {

    
    this.user$ = authState(this.auth).pipe(
      startWith( null ),
      switchMap( ( user ) => {
        console.log()
        if ( !user ) {
          console.log( "UserData: Firebase user null.  Stop monitoring user date  " );
          return of( null );
        } else {
          console.log( `UserData: monitoring uid: ${user.uid}` );
          const d = doc(this.firestore, user.uid) as DocumentReference<UserData>
          return docData(d);
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
    return updateDoc(this._getUserDoc(), details);
  }

  private _doc(uid: string): DocumentReference<UserData> {
    return doc( this.firestore, "users/" + uid ) as DocumentReference<UserData>;
  }

  /** Get the database documents associated with the user
   * The user must be logged in to use this function.
   */
  private _getUserDoc(): DocumentReference<UserData> {

    const userDoc = doc(this.firestore, "users/" + this.uid) as DocumentReference<UserData>;
    return userDoc;
  }

  
  /** Add userResult to the user results list, populating detail from the results data.
   * The user defaults to the current user.
  */
  addResult( userResult: UserResult, user = this.currentUserData ): Observable<void> {

    const obs = this.rs.loadResults( userResult.event ).pipe(
      tap( results => this._processResults( user.results, results, userResult ) ),
      switchMap( () => setDoc( this._getUserDoc(), user ) )
    );

    return obs;
  }

  private _processResults( userResults: UserResult[], results: Results, userResult: UserResult ) {

    // Find competitor by ecard. Note that a synthtic ecard will be assigned if the event does not have ecard values.
    const comp = results.findCompetitorByECard( userResult.ecardId );

    // Populate result data for the user
    const course = comp.courseClass.course;
    const courseWinner = this._getCourseWinner( course );

    userResult.result = {
      course: course.name,
      courseclass: comp.courseClass.name,

      coursePosition: comp.classPosition,
      classPosition: comp.order,
      totalTime: comp.totalTime,

      distance: course.length,
      climb: course.climb,

      courseWinner: courseWinner.name,
      courseWinningTime: courseWinner.totalTime,

      classWinner: comp.courseClass.competitors[0].name,
      classWinningTime: comp.courseClass.competitors[0].totalTime

    };
    userResults.push( userResult );

    // sort results by event date by default
    userResults.sort( ( a, b ) => {
      const d1 = new Date( a.event.date );
      const d2 = new Date( b.event.date );
      return d1.valueOf() - d2.valueOf();
    } );
  }

  private _getCourseWinner( course: Course ): Competitor {
    if ( course.classes.length === 0 ) {
      return null;
    }

    let winner = course.classes[0].competitors[0];
    course.classes.forEach( eclass => {
      if ( eclass.competitors[0].totalTime < winner.totalTime ) {
        winner = eclass.competitors[0];
      }
    } );
    return winner;
  }

  async removeResult( user: UserData, result: UserResult ): Promise<void> {
    if ( user.key !== this.uid ) {
      throw new InvalidData( "User data key must match signed in user" );
    }

    const index = user.results.indexOf( result );
    if ( index > -1 ) {
      user.results.splice( index, 1 );
    }
    return setDoc( this._getUserDoc(), user );
  }

  private _createUserResult( comp: CompetitorSearchData, event: OEvent ): UserResult {
    return {
      ecardId: comp.ecardId,
      event: event,
      firstname: comp.first,
      surname: comp.surname,
      club: comp.club,
      result: null,
    };
  }
}
