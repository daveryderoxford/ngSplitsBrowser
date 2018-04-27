import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { OEvent, EventInfo, EventGrades, EventTypes, EventDisciplines } from 'app/model/oevent';
import { Nations, Nation } from 'app/model/nations';

import { MatSnackBar } from '@angular/material';
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
  grades = EventGrades.grades;
  nations = Nations.getNations();
  types = EventTypes.types;
  disciplines = EventDisciplines.disciplines;
  email: string;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private eventService: EventAdminService,
    public snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  private createForm() {
    this.f = this.formBuilder.group({
      name: ["", Validators.required],
      date: ["", Validators.required],
      nationality: ["", Validators.required],
      club: ["", Validators.required],
      grade: ["", Validators.required],
      type: ["", Validators.required],
      discipline: ["", Validators.required],
      webpage: ["", Validators.pattern(/((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/i)]
    });

  }

  ngOnInit() {

  }

  // tslint:disable-next-line:use-life-cycle-interface
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

  private addhttp(url: string | null): string | null {
  if (url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "http://" + url;
    }
  }
    return url;
  }

async submit() {

  if (this.f.valid) {

    try {
      this.showProgressBar = true;

      this.f.value.webpage = this.addhttp(this.f.value.webpage);

        if (this.new) {
          await this.eventService.saveNew(this.f.value);
        } else {
          await this.eventService.updateEventInfo(this.oevent.key, this.f.value);
        }
        this.showProgressBar = false;
      } catch (err) {
        this.showProgressBar = false;
        const snackBarRef = this.snackBar.open("Error updating event information");
        console.log("EventEditComponent:  Error updating event information " + err);
      }

      //  this.eventSubmitted.emit(this.event);

    }
  }
}
