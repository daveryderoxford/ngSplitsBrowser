import { Injectable, Inject } from '@angular/core';
import { OEvent, EventInfo, EventSummary, CourseSummary } from 'app/model/oevent';
// import * as sb from './filereader/splitsbrowser.data';

import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import {SplitsBrowser} from './filereader/splitsbrowser.data'

@Injectable()
export class EventAdminService {

  constructor(private afAuth: AngularFireAuth,
    private firebaseApp: FirebaseApp,
    private af: AngularFireDatabase) { }

  /** Create new event speciting event info */
  async saveNew(eventInfo: EventInfo) {
    const event = <OEvent>eventInfo;

    // Reformat the date to an ISO date.  I should not need ot do this.
    event.eventdate = new Date(event.eventdate).toISOString();

    event.user = this.afAuth.auth.currentUser.uid;
    event.user_date_index = event.user + this.decTimeIndex(event.eventdate);

     this.setIndices(event);

    // save the new event
    const events: FirebaseListObservable<OEvent[]> = this.af.list('/events/');
    console.log('EventService:  Adding Event ' + JSON.stringify(event));
    const p = await events.push(event);
    console.log('EventService:  Event added');
    return (p);
  }

  async updateEventInfo(key: string, eventInfo: OEvent) {
    const event = <OEvent>eventInfo;

    this.setIndices(event);
    console.log('EventService: Updating key ' + key);

    const events: FirebaseListObservable<OEvent[]> = this.af.list('/events/');
    const p = await events.update(key, eventInfo);
    console.log('EventService:  Event updated ' + key);
    return (p);
  }

  private setIndices(event: OEvent) {
    event.club_date_index  = this.padRight(event.club, 20) + this.decTimeIndex(event.eventdate);
    event.date_club_index = this.decTimeIndex(event.eventdate) + this.padRight(event.club, 20);
  }

  private decTimeIndex(dateStr: string): string {
    const d1 = new Date('2050-01-01 00:00:00').getTime() / 1000;
    const d2 = new Date(dateStr).getTime() / 1000;
    const minusDate =  d1 - d2;

    const str = this.padLeft(minusDate.toString(), 15)
    return (str);
  }

  private padRight(str: string, length: number): string {
    const maxUTF8Character = '\uffff';
    while (str.length < length) {
      str = str + maxUTF8Character;
    }
    return str;
  }

  private padLeft(str: string, length: number): string {
    const maxUTF8Character = '\uffff';
    while (str.length < length) {
      str = maxUTF8Character + str;
    }
    return str;
  }

  async delete(key: string) {
    // Delete stored files


    // Delete record
    return (await this.af.database.ref('/events/' + key).remove());
  }


  /** Asymc functiom to read and parse splits and upload splits.
   * An observable of the upload process is retsuned allowing the client to monitor the upload tha may take some time.   */
  async uploadSplits(oevent: OEvent, file: File) {

    const text = await this.loadTextFile(file);

    const results = this.parseSplits(text, oevent);
    const summary = this.populateSummary(results);

    // Save file
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'results/' + uid + '/' + oevent.$key + '-results';
    await this.uploadToGoogle(text, path);

     // Save Summary
     await this.af.database.ref('/events/' + oevent.$key).update( { summary: summary} );

    console.log('EventAdminService: Splits  uploaded ' + file + '  to' + path);

  }

  /** Async function to load a file from disk returning text string containing file contents */
  private async loadTextFile(file: File): Promise<string> {

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const text = event.target.result;
        resolve(text);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsText(file);

    });
  }

  /* Parse splits file returning parsed results */
  private parseSplits(text: string, oevent: OEvent): any {

    let results: any;
    try {
      results = SplitsBrowser.Input.parseEventData(text);
    } catch (e) {
      if (e.name === 'InvalidData') {
         console.log('EventAdminServicese Error parsing results' + e.message);
      }  else {
         console.log('EventAdminServicese Error parsing results' + e);
      }
      throw e;
    }

    return (results);
  }

  private async uploadToGoogle(text: string, path: string): Promise<any> {

    return (this.firebaseApp.storage().ref().child(path).putString(text));

  }

  private populateSummary(results: any): EventSummary {
    const summary: EventSummary = {
      numcompetitors: 0,
      courses: new Array()
    };

    results.courses.forEach((course) => {
      const courseSummary = this.createCourseSummary(course);

      course.classes.forEach((eclass) => {
        courseSummary.numcompetitors = courseSummary.numcompetitors + eclass.competitors.length;
        summary.numcompetitors = summary.numcompetitors + eclass.competitors.length;
        courseSummary.classes.push(eclass.name);
      });
      summary.courses.push(courseSummary);
    });

    return (summary);
  }

  private createCourseSummary(course: any): CourseSummary {
    const summary: CourseSummary = {
      name: course.name,
      length: course.length,
      controls: course.controls,
      climb: course.climb,
      classes: new Array(),
      numcompetitors: 0,
      winner: ''
    };
    return (summary);
  }
}


