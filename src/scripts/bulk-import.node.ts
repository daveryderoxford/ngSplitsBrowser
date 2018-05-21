
/** Node script to import JSON
 * ts-node bulk-inoirt.node
*/
import { Http } from "@angular/http";
import { FirebaseApp } from "angularfire2";
import { AngularFireDatabase } from "angularfire2/database";
import { LogEntry } from "../app/model/log-entry";
import { Club, EventGrades, EventSummary, OEvent, SplitsFileInfo } from "../app/model";
import { EventAdminService } from "../app/event-admin/event-admin.service";
import { Utils } from "../app/shared";
import * as data from "./importdata.node";

/* Service to import exisitng resilts */

export class BulkImportService {

  constructor(private firebaseApp: FirebaseApp,
    private af: AngularFireDatabase,
    private eventAdminService: EventAdminService,
    private http: Http
  ) { }

  async loadEvents() {
    for (const inputEvent of data.inputJSON) {
      await this.processEvent(inputEvent);
    }
  }

  private async processEvent(inputEvent: data.ImportData) {

    const splits: SplitsFileInfo = {
      splitsFilename: "results/legacy/" + inputEvent.id,
      splitsFileFormat: inputEvent.format,
      valid: true
    };

    const grade = EventGrades.grades[inputEvent.type];

    const event: OEvent = {
      key: "TODO need to specify the key to match existing import",
      name: inputEvent.name,
      nationality: inputEvent.nationality,
      date: new Date(inputEvent.eventdate * 1000).toISOString(),
      club: inputEvent.club,
      grade: grade,
      type: "Foot",
      discipline: "Long",
      webpage: inputEvent.webpage,
      splits: splits,
      email: inputEvent.email,
      user: "qWLOONZF1NhBZCV1FI9htz3AitI2",
      legacyPassword: inputEvent.legacyPassword,
      yearIndex: new Date(inputEvent.eventdate * 1000).getFullYear(),
      gradeIndex: EventGrades.indexObject(grade)
    };


    try {
      event.summary = await this.createEventSummary(event.splits.splitsFilename);
      if (event.summary.courses.length === 0) {
        const message1 = ("No courses found for event" + inputEvent.id + "  Name: " + event.name);
        await this.log({ severity: "WARN", source: "BulkImportService", msg: message1 });
        event.splits.valid = false;
      }
    } catch (e) {
      const message2 = "Error parsing results Input event Id:" + inputEvent.id + "  Name: " + event.name + "   Message  " + e.message;
      await this.log({ severity: "WARN", source: "BulkImportService", msg: message2 });
      event.splits.valid = false;
    }
    await this.writeEvent(inputEvent.id, event);

    await this.updateClubs(event);

    const message3 = "Event sucessfully imported event Id:" + inputEvent.id + "  Name: " + event.name;
    await this.log({ severity: "INFO", source: "BulkImportService", msg: message3 });
  }

  private getEventsForClubName(clubName: string): Promise<OEvent[]> {
    const obs = this.af.list<OEvent>("/events", ref => ref.orderByChild("club").equalTo(clubName) ).valueChanges() ;

    return(obs.toPromise());
  }

  private async updateClubs(event: OEvent) {

    const key = Utils.getClubKey(event.club, event.nationality);

    let events = await this.getEventsForClubName(event.club);
    events = events.filter((e) => { return (e.nationality === event.nationality); });

    // if no reference then remove the club
    if (events.length === 0) {
      // muct be an error as club added
      this.log( {severity: "ERROR", source: "BulkImportService",  msg: "Error club not found " + event.club} );
      await this.af.object("/clubs/ +  key").remove();
    } else {
      const club: Club = {
        name: event.club,
        nationality: event.nationality,
        numEvents: events.length
      };
      await this.af.object("/clubs/" + key).set(club);
    }
  }

  private async log(log: LogEntry) {
    if (!log.source)  {
      log.source = "    ";
    }

    if (!log.severity)  {
      log.severity = "DEBUG";
    }

    console.log(log.severity + "  " + log.source + "   " + log.msg);
    log.timestamp = new Date().toISOString();
    if (log.severity !== "DEBUG") {
         const ref = this.af.object(/logs/ + Utils.encodeAsFirebaseKey(log.timestamp));
         await ref.set(log);
    }
  }

  private async createEventSummary(filename: string): Promise<EventSummary> {
    const text = await this.readFromGoogle(filename);
    const results = this.eventAdminService.parseSplits(text, null);
    const summary = this.eventAdminService.populateSummary(results);
    return (summary);
  }

  async writeEvent(key: string, event: OEvent): Promise<void> {
    const ref = this.af.object(/events/ + key);
    await ref.set(event);
  }

  private async readFromGoogle(path: string): Promise<string> {
    const url = await this.firebaseApp.storage().ref().child(path).getDownloadURL();
    return (this.http.get(url).map(res => res.text()).toPromise());
  }
}
