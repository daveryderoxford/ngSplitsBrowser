import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { OEvent, EventInfo, EventTypes } from 'app/model/oevent';
import { Nations, Nation } from 'app/model/nations';

import { MdSnackBar } from '@angular/material';
import { EventAdminService } from 'app/upload/event-admin.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {
  @Input() oevent: OEvent;
  new = true;
  @Output() eventSubmitted = new EventEmitter<EventInfo>();
  showProgressBar = false;


  f: FormGroup;
  nations = Nations.getNations();
  types = EventTypes.types;

  filteredNations: Observable<Nation[]>;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private af: AngularFireDatabase,
    private eventService: EventAdminService,
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

  private filterNations(name: string): Nation[] {
    const ret = this.nations.filter(nation => new RegExp(`^${name}`, 'gi').test(nation.fullname));
    return (ret);
  }

  private ngOnChanges(changes: SimpleChanges) {
    // set the form fields then the evnt is changed.
    if (this.oevent === null) {
      this.new = true;
      this.createForm();
      this.f.reset();
    } else {
      this.new = false;
      this.f.reset(this.oevent);
    }
  }

  cancel() {
    if (this.f.dirty) {
      // display a warning****
    }
  }

  async submit() {

    if (this.f.valid) {

      try {
        this.showProgressBar = true;
        if (this.new) {
          await this.eventService.saveNew(this.f.value);
        } else {
          await this.eventService.updateEventInfo(this.oevent.$key, this.f.value);
        }
        this.showProgressBar = false;
      } catch (err) {
        this.showProgressBar = false;
        const snackBarRef = this.snackBar.open('Error updating event information');
        console.log('EventEditComponent:  Error updating event information ' + err);
      }

      //  this.eventSubmitted.emit(this.event);

    }
  }
}
