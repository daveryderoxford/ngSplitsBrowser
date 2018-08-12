import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { EventAdminService } from '../event-admin.service';
import { Nations } from '../../model/nations';
import { EventDisciplines, EventGrades, EventInfo, EventTypes, OEvent } from '../../model/oevent';
import { Club } from '../../model';
import { Observable } from 'rxjs/Observable';
import { startWith, map, filter } from 'rxjs/operators';
import { EventService } from '../../events/event.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
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


  clubs: Club[] = [];
  filteredClubs$: Observable<Club[]>;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private eventService: EventAdminService,
    private es: EventService,
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

    this.filteredClubs$ = Observable.combineLatest(this.es.getClubs(),
                                                    this.f.controls.club.valueChanges.startWith(''),
                                                    this.f.controls.nationality.valueChanges.startWith(''))
      .pipe(
        filter(club => (club !== null || club !== [])),
        map(([clubs, name, nat]) => this.filterClubs(clubs, name, nat))
      );

    this.filteredClubs$.subscribe((clubs) => {
      this.clubs = clubs;
    });
  }

  filterClubs(clubs: Club[], name: string, nationality: string): Club[] {

    const ret: Club[] = [];

    if (clubs) {
      for (const club of clubs) {
        if (!nationality || nationality === '' || club.nationality === nationality) {
          if (!name || name === '') {
            ret.push(club);
          } else if (club.name.startsWith(name.toUpperCase())) {
            ret.push(club);
          }
        }
      }
    }
    return ret;
  }

  displayFn(club?: Club): string | undefined {
    return club ? club.name : undefined;
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
