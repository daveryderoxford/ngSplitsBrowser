import { Component, OnInit } from '@angular/core';

import { OEvent } from 'app/model/oevent';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  events: FirebaseListObservable<OEvent[]>;

  constructor( private db: AngularFireDatabase) { }

 ngOnInit() {

    const opts = {
      query: {
        orderByChild: 'date_club_index',
        limitToFirst: 10
      }
    };

    this.events = this.db.list('/events', opts);

  }

}
