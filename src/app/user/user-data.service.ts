import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import {
   AngularFirestore,
   AngularFirestoreDocument
} from "angularfire2/firestore";
import { OEvent } from "../model/oevent";
import { UserData, UserInfo, UserResultData } from "../model/user";
import { Competitor, Course, InvalidData } from "../results/model";
import { Observable } from "rxjs/Observable";
import { UnexpectedError } from "../results/model/exception";
import { BehaviorSubject } from "rxjs";
import * as firebase from "firebase";

@Injectable({
   providedIn: "root"
})
export class UserDataService {

   private _currentUserData = new BehaviorSubject<UserData>(null);

   constructor(
      private afAuth: AngularFireAuth,
      private afs: AngularFirestore
   ) {

    this.afAuth.authState.subscribe((user: firebase.User) => {
      if (user === null) {
       this._currentUserData.next(null);
      } else {
        this.getUserDataObservable().subscribe( (userData) => {
          this._currentUserData.next(userData);
        } );
      }
    });
   }

   /** Get a reference to use data for a user, creating it if it does not exist
    * Returns null if user is not
   */
   getUser(): Observable<UserData | null> {
     return this._currentUserData.asObservable();
   }

  private getUserDataObservable(): Observable<UserData | null> {
    const user = this.getUserDoc()
        .snapshotChanges()
        .map(ret => {
          const snapshot = ret.payload;
          if (!snapshot.exists) {
              this.createUser();
          }
          return snapshot.data() as UserData;
        });
        return user;
   }

   /** Update the user info.  Returning the modofoed user details */
   async updateDetails(details: Partial<UserInfo>): Promise<UserData> {

      await this.getUserDoc().update(details);

      // reread the complete user and return it
      const user: UserData = await this.getUserDoc()
         .snapshotChanges()
         .map(ret => ret.payload.data() as UserData)
         .toPromise();

      return user;
   }

   /** Creates new user data and saves it to the database */
   private createUser(): Promise<void> {
      const userdata = {
         key: this.afAuth.auth.currentUser.uid,
         firstName: "",
         lastName: "",
         club: "",
         nationality: "",
         nationalId: "",
         ecardEmit: "",
         ecardSI: "",
         autoFind: true,
         results: [],
         ecards: [],
         resultsLastupDated: new Date()
      };
      const user = this.getUserDoc().set(userdata);

      return user;
   }

   /** Get the database documents associated with the user
    * The user must be logged in to use this function.
    */
   private getUserDoc(): AngularFirestoreDocument<UserData> {
      const uid = this.afAuth.auth.currentUser.uid;
      const userDoc = this.afs.doc<UserData>("users/" + uid);
      return userDoc;
   }

   /** Add a result for the currently signed in user.  the results  for the event must be in memory */
   async addResult(
      user: UserData,
      result: Competitor,
      event: OEvent
   ): Promise<any> {
      if (user.key !== this.afAuth.auth.currentUser.uid) {
         throw new InvalidData("User data key must match signed in user");
      }

      if (!result.courseClass || !result.courseClass.course) {
         throw new UnexpectedError(
            "Course and class must be defined for competitor to add to results"
         );
      }

      const course = result.courseClass.course;

      const courseWinner = this.getCourseWinner(course);

      // Extract information on the result to save against the user
      const userResult: UserResultData = {
         ecardId: result.ecardId,
         event: event,
         course: course.name,
         courseclass: result.courseClass.name,

         name: result.name,
         coursePosition: result.classPosition,
         classPosition: result.order,
         totalTime: result.totalTime,

         distance: course.length,
         climb: course.climb,

         courseWinner: courseWinner.name,
         courseWinningTime: courseWinner.totalTime,

         classWinner: result.courseClass.competitors[0].name,
         classWinningTime: result.courseClass.competitors[0].totalTime
      };

      user.results.push(userResult);

      // sort results by event date by default
      user.results.sort((a, b) => {
         const d1 = new Date(a.event.date);
         const d2 = new Date(b.event.date);
         return d1.valueOf() - d2.valueOf();
      });
   }

   private getCourseWinner(course: Course): Competitor {
      if (course.classes.length === 0) {
         return null;
      }

      let winner = course.classes[0].competitors[0];
      course.classes.forEach(eclass => {
         if (eclass.competitors[0].totalTime < winner.totalTime) {
            winner = eclass.competitors[0];
         }
      });
      return winner;
   }

   async removeResult(user: UserData, result: UserResultData): Promise<void> {
      if (user.key !== this.afAuth.auth.currentUser.uid) {
         throw new InvalidData("User data key must match signed in user");
      }

      const index = user.results.indexOf(result);
      if (index > -1) {
         user.results.splice(index, 1);
      }
      return this.getUserDoc().set(user);
   }
}
