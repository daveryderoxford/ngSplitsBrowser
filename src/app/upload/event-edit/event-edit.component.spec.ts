import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventEditComponent } from './event-edit.component';

import { OEvent, EventTypes } from '../model/oevent';
import { Nations, Nation } from '../model/nations';
import { Observable } from 'rxjs/Observable';

describe('EventEditComponent', () => {
  let component: EventEditComponent;
  let fixture: ComponentFixture<EventEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should take an event', () => {
    const event: OEvent = {
      eventId: 22,
      name: 'Test name',
      user: 'auser',
      nationality: 'GBR',
      date: new Date('2017-01=-2'),
      type: 'local',
      club: 'TVOC',
      webpage: 'www.test.com',
      email: 'fred@test.com',
      splitsFilename: '',
     splitsFileFormat: '',
     legacyPassword: '',
     summary: null,
    };

   component.event = event;

    expect(component).toBeTruthy();
  });
});
