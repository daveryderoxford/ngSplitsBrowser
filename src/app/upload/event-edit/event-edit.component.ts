import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { OEvent, EventInfo, EventTypes } from 'app/model/oevent';
import { Nations, Nation } from 'app/model/nations';

import { AngularFireAuth } from 'angularfire2/auth';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {
  @Input() oevent: OEvent;
  new = true;
  @Output() eventSubmitted = new EventEmitter<EventInfo>();

  f: FormGroup;
  nations = Nations.getNations();
  types = EventTypes.types;

  filteredNations: Observable<Nation[]>;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private af: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    public snackBar: MdSnackBar
  ) {
    this.createForm();
  }

  private createForm() {
    this.f = this.formBuilder.group({
      name: ['', Validators.required],
      eventdate: ['', Validators.required],
      nationality: ['', Validators.required],
      club: ['', Validators.required],
      type: ['', Validators.required],
      webpage: '',
    });
  }

  ngOnInit() {

    this.filteredNations = this.f.get('nationality').valueChanges
      .startWith(null)
      .map(val => val ? this.filterNations(val) : this.nations.slice());
  }

  private filterNations(val: Nation): Nation[] {
    const ret = this.nations.filter(nation => new RegExp(`^${val}`, 'gi').test(nation.fullname));
    return (ret);
  }

  private ngOnChanges(changes: SimpleChanges) {
    // set the form fields then the evnt is changed.
    if (this.oevent === null) {
      this.new = true;
      this.f.reset();
      this.createForm();
    } else {
      this.new = false;
      this.f.reset(this.oevent);
    }
  }

  private async saveNew() {
    const events: FirebaseListObservable<OEvent[]> = this.af.list('/events/');
    const event: OEvent = {
      name: this.f.value.name,
      eventdate: this.f.value.eventdate.toISOString(),
      nationality: this.f.value.nationality,
      club: this.f.value.club,
      type: this.f.value.type,
      webpage: this.f.value.webpage,
      email: '',
      user: this.afAuth.auth.currentUser.uid
    };
    console.log('EventEditComponent:  Adding Event ' + JSON.stringify(event));
    await events.push(event);
    console.log('EventEditComponent:  Event added');
  }

  private async update() {
    console.log('EventEditComponent: Updating key ' + this.oevent.$key);
    const events: FirebaseListObservable<OEvent[]> = this.af.list('/events/');
    await events.update(this.oevent.$key, this.f.value);
    console.log('EventEditComponent:  Event updated');
  }

  cancel() {
    if (this.f.dirty) {
      // display a warning****
    }
  }

  async submit() {

    if (this.f.valid) {
      try {
        if (this.new) {
          await this.saveNew();
        } else {
          await this.update();
        }
      } catch (err) {
        const snackBarRef = this.snackBar.open('Error updating event information');
        console.log('EventEditComponent:  Error updating event information ' + err);
      }

      //  this.eventSubmitted.emit(this.event);

    }
  }
}
