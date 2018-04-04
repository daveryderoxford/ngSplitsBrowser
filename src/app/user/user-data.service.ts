import { Injectable } from "@angular/core";
import { UserData, UserResultData } from "app/model/user";
import { AngularFireAuth } from "angularfire2/auth";

import * as firebase from "firebase/app";
import { FirebaseApp } from "angularfire2";
import { AngularFireDatabase } from "angularfire2/database";
import { OEvent } from "app/model/oevent";

import { Competitor, CourseClass, Course } from "app/results/model";

import { EventInfo } from "../../../firebase/functions/src/index";
import { Observable } from "rxjs/Observable";

@Injectable()
export class UserDataService {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase) { }

  /** Get a reference to use data for a user creating it if it does not exist */
  getUser(): Observable<UserData> {

    const user = this.db.object<UserData>(this.getPath()).valueChanges();

    // if user does does not exist create a user object
    user.subscribe((userData) => {
      if (!userData) {
        this.createUser();
      }
    });

    return (user);

  }

    /** Saves  */
    async updateDetails(details: EventInfo): Promise<any> {
      await this.getRef().update(details);
    }

  private createUser() {
    const user = {
      firstName: "",
      lastName: "",
      club: "",
      nationality: "",
      nationalId: "",
      yearOfBirth: "",
      ecardEmit: "",
      ecardSI: "",
      autoFind: "",
      events: []
    }
    this.getRef().set(user);
  }

  private getPath(): string {
    const uid = this.afAuth.auth.currentUser.uid;
    return ("users/" + uid);
  }

  private getRef() {
    return (this.db.object(this.getPath()));
  }

  /** Add a result for the currently signed in user  */
  async addResult(user: UserData, result: Competitor, courseclass: CourseClass, course: Course, event: OEvent): Promise<any> {

    const courseWinner = this.getCourseWinner(course);

    // Denormalise the result.
    const userResult: UserResultData = {
      eventInfo: event,
      course: course.name,
      courseclass: courseclass.name,

      name: result.name,
      classPosition: result.order,
      totalTime: result.totalTime,

      distance: course.length,
      climb: course.climb,

      courseWinner: courseWinner.name,
      courseWinningTime: courseWinner.totalTime,

      classWinner: courseclass.competitors[0].name,
      classWinningTime: courseclass.competitors[0].totalTime,
    }

    user.results.push(userResult);

    user.results.sort((a, b) => {
      const d1 = new Date(a.eventInfo.eventdate);
      const d2 = new Date(b.eventInfo.eventdate);
      return ( d1.valueOf() - d2.valueOf() );
    });

    return (this.getRef().set(user));

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

  async removeResult(result: UserResultData): Promise<any> {
    const user = await this.db.object<UserData>(this.getPath()).valueChanges().toPromise();

    const index = user.results.indexOf(result);
    if (index > -1) {
      user.results.splice(index, 1);
    }
    return (this.getRef().set(user));

  }

}

