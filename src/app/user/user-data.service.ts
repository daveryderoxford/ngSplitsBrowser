import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { EventService } from "app/events/event.service";
import { CompetitorSearchData, ECard, OEvent, UserData, UserInfo, UserResult } from "app/model";
import { Competitor, Course, InvalidData, Results } from "app/results/model";
import { ResultsSelectionService } from "app/results/results-selection.service";
import { CompetitorDataService } from "app/shared/services/competitor-data.service";
import firebase from "firebase/compat/app";
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
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private csd: CompetitorDataService,
    private es: EventService,
    private rs: ResultsSelectionService
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

  /** Add userResult to the user results list, populating detail from the results data.
   * The user defaults to the current user.
  */
  addResult( userResult: UserResult, user = this.currentUserData ): Observable<void> {

    const obs = this.rs.loadResults( userResult.event ).pipe(
      tap( results => this._processResults( user.results, results, userResult ) ),
      switchMap( () => this._getUserDoc().set( user ) )
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
    return this._getUserDoc().set( user );
  }

  /** Find user results for the current user  */
  async findUserResults( ecard: ECard ): Promise<UserResult[]> {
    //
    const searchResults = await this.csd.searchResultsByECard( ecard.id );

    // Get the event for each search result
    const userResults: UserResult[] = [];
    for ( const compSearch of searchResults ) {
      const oevent = await this.es.getEvent( compSearch.eventKey ).pipe( take( 1 ) ).toPromise();
      const userResult = this._createUserResult( compSearch, oevent );
      userResults.push( userResult );
    }

    // Sort by time
    //  userResults.sort( (a: UserResult, b) => new Date(a.event.date) - new Date (b.event.date) );

    return userResults;
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
