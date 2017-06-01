import { Injectable, Inject } from '@angular/core';
import { OEvent, EventSummary, CourseSummary } from 'app/model/oevent';
// import * as SplitsBrowser from './filereader/splitsbrowser.data';

import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import { FirebaseApp } from 'angularfire2';

@Injectable()
export class EventAdminService {

  constructor(private afAuth: AngularFireAuth,
               private firebaseApp: FirebaseApp) { }

  /** Asymc functiom to read and parse splits and upload splits.
   * An observable of the upload process is retsuned allowing the client to monitor the upload tha may take some time.   */
  async uploadSplits(oevent: OEvent, file: File) {

    console.log('EventAdminService: Start reading splits file' + file.name);
    const text = await this.loadTextFile(file);
    console.log('EventAdminService: Complete reading splits file');


  //    const results = this.parseSplits(text, oevent);
  //  const summary = this.populateSummary(results);

    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'results/' + uid + '/' + oevent.$key + '-results';
        console.log('EventAdminService: Satrt upload splits' + text);

    await this.uploadToGoogle(text, path);
        console.log('EventAdminService: End upload splits' );

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

  /* parse splits file returing parsed results */
  private parseSplits(text: string, oevent: OEvent): any {

    let results: any;
    try {
     //  results = SplitsBrowser.Input.parseEventData(text);
    } catch (e) {
      if (e.name === 'InvalidData') {
        console.log('EventAdminServicese Error parsing results' + e.message);
        return;
      } else {
        throw e;
      }
    }

    return (results);
  }

  private async uploadToGoogle(text: string, path: string): Promise<any> {

      return( this.firebaseApp.storage().ref().child(path).putString(text) );

     // uploadTask.on(firebase.storage.TaskState.SUCCESS, () => { resolve(); }) ;
     // uploadTask.on(firebase.storage.TaskState.ERROR, () => { reject(); }) ;
    //  uploadTask.on(firebase.storage.TaskState.CANCELED, () => { reject(); }) ;
  }

  private populateSummary(results: any): EventSummary {
    const summary: EventSummary = {
      numcompetitors: 0,
      courses: new Array()
    };

    results.courses.map((course) => {
      const courseSummary = this.createCourseSummary(course);

      course.classes.map((eclass) => {
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


