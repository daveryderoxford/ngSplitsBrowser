import { Injectable, Inject } from '@angular/core';
import { OEvent, EventInfo, EventSummary, CourseSummary, SplitsFileFormat} from 'app/model/oevent';
// import * as sb from './filereader/splitsbrowser.data';

import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import {SplitsBrowser} from './filereader/splitsbrowser.data'

@Injectable()
export class EventAdminService {

  constructor(private afAuth: AngularFireAuth,
    private firebaseApp: FirebaseApp,
    private af: AngularFireDatabase) { }

  /** Create new event specifying event info */
  async saveNew(eventInfo: EventInfo) {
    const event = <OEvent>eventInfo;

    // Reformat the date to an ISO date.  I should not need ot do this.
    event.eventdate = new Date(event.eventdate).toISOString();
    event.user = this.afAuth.auth.currentUser.uid;


    // save the new event
    const events: FirebaseListObservable<OEvent[]> = this.af.list('/events/');
    console.log('EventService:  Adding Event ' + JSON.stringify(event));
    const e = await events.push(event);

   // await this.updateClubLookup(e.key, event);

    console.log('EventService:  Event added');

  }


  /** Update the event info for an event */
  async updateEventInfo(key: string, eventInfo: EventInfo) {
    const event = <OEvent>eventInfo;

    console.log('EventService: Updating key ' + key);

    const events: FirebaseListObservable<OEvent[]> = this.af.list('/events/');
    const p = await events.update(key, eventInfo);
    console.log('EventService:  Event updated ' + key);
    return (p);
  }


  async delete(oevent: OEvent) {
    // Delete results file
    if (oevent.splits) {
       await this.firebaseApp.storage().ref().child(oevent.splits.splitsFilename).delete();
     }
    // Delete record
    return (await this.af.database.ref('/events/' + oevent.$key).remove());
  }

/** Loads splits from a file */
  async loadResults(oevent: OEvent, file: File): Promise<any> {
      const text = await this.loadTextFile(file);
      const results = this.parseSplits(text, oevent);

      return new Promise<any>((resolve) => {
         resolve(results);
      });
  }

  /** Async functiom to read and parse splits and upload splits.*/
    async uploadSplits(oevent: OEvent, file: File, fileFormat: SplitsFileFormat = 'auto') {

    const text = await this.loadTextFile(file);

    const results = this.parseSplits(text, oevent);

    oevent.summary = this.populateSummary(results);

    // Save file
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'results/' + uid + '/' + oevent.$key + '-results';
    await this.uploadToGoogle(text, path);
    oevent.splits = {
      splitsFilename: path,
      splitsFileFormat: fileFormat
    }
    await this.af.database.ref('/events/' + oevent.$key).set(oevent);

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
      climb: course.climb,
      classes: new Array(),
      numcompetitors: 0,
      winner: ''
    };
    return (summary);
  }
}


