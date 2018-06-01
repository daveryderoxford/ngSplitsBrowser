import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import { OEvent } from "app/model/oevent";
import { UserData, UserInfo, UserResultData } from "app/model/user";
import { Competitor, Course, InvalidData } from "app/results/model";
import { Observable } from "rxjs/Observable";

@Injectable({
  providedIn: 'root',
})
export class UserDataService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore) { }

  /** Get a reference to use data for a user, creating it if it does not exist */
   getUser(): Observable<UserData> {
    const user = this.getUserDoc().snapshotChanges().map( (ret) => {
      const snapshot = ret.payload;
      if (!snapshot.exists) {
        this.createUser();
      }
      return snapshot.data() as UserData;
    });

    return (user);
  }

    /** Update the user info */
    async updateDetails(details: Partial<UserInfo>): Promise<void> {
      await this.getUserDoc().update(details);
    }

  private createUser(): Promise<void> {
    const user = {
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
    return this.getUserDoc().set(user);
  }

  private getUserDoc(): AngularFirestoreDocument<UserData> {
    const uid = this.afAuth.auth.currentUser.uid;
    const userDoc = this.afs.doc<UserData>("users/" + uid);
    return userDoc;
  }

  /** Add a result for the currently signed in user  */
  async addResult(user: UserData, result: Competitor, event: OEvent): Promise<any> {

    if (user.key !== this.afAuth.auth.currentUser.uid) { throw new InvalidData("User data key must match signed in user"); }

    const course = result.courseClass.course;

    const courseWinner = this.getCourseWinner(course);

    // Extract information on the result to save against the user
    const userResult: UserResultData = {
      eventInfo: event,
      course: course.name,
      courseclass: result.courseClass.name,

      name: result.name,
      classPosition: result.order,
      totalTime: result.totalTime,

      distance: course.length,
      climb: course.climb,

      courseWinner: courseWinner.name,
      courseWinningTime: courseWinner.totalTime,

      classWinner: result.courseClass.competitors[0].name,
      classWinningTime: result.courseClass.competitors[0].totalTime,
    };

    user.results.push(userResult);

    user.results.sort((a, b) => {
      const d1 = new Date(a.eventInfo.date);
      const d2 = new Date(b.eventInfo.date);
      return ( d1.valueOf() - d2.valueOf() );
    });

    return this.getUserDoc().set(user);

  }

  private getCourseWinner(course: Course): Competitor {

    if (course.classes.length === 0) {
      return (null);
    }

    let winner = course.classes[0].competitors[0];
    course.classes.forEach((eclass) => {
      if (eclass.competitors[0].totalTime < winner.totalTime) {
        winner = eclass.competitors[0];
      }
    });
    return (winner);
  }

  async removeResult(user: UserData, result: UserResultData): Promise<void> {

    if (user.key !== this.afAuth.auth.currentUser.uid) { throw new InvalidData("User data key must match signed in user"); }

    const index = user.results.indexOf(result);
    if (index > -1) {
      user.results.splice(index, 1);
    }
    return this.getUserDoc().set(user);

  }
}
