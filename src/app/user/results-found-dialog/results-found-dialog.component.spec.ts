import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResultsFoundDialogComponent } from './results-found-dialog.component';
import { UserResult, OEvent } from 'app/model';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppMaterialModule } from 'app/shared/components/material/app-material.module';
import { DialogsModule } from 'app/shared/dialogs/dialogs.module';


const event1: OEvent = null;


// eslint-disable-next-line max-len
const comp1: UserResult = { event: event1, firstname: 'Fred', surname: 'Bloggs', club: 'SN', ecardId: '111111111', result: null };
// eslint-disable-next-line max-len
const comp2: UserResult = { event: event1,  firstname: 'Jame', surname: 'Tims', club: 'HAVOC', ecardId: '22222222', result: null };
// eslint-disable-next-line max-len
const comp3: UserResult = { event: event1, firstname: 'This is a long christina name', surname: 'Bloggs', club: 'BKO', ecardId: '33333333', result: null };

const found: UserResult[] = [comp1, comp2, comp3];

let dialog: MatDialog;
let overlayContainerElement: HTMLElement;

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [DialogsModule, AppMaterialModule, ResultsFoundDialogComponent],
    providers: [
        {
            provide: OverlayContainer, useFactory: () => {
                overlayContainerElement = document.createElement('div');
                return { getContainerElement: () => overlayContainerElement };
            }
        }
    ]
});

  dialog = TestBed.get(MatDialog);
});

describe('ResultsFoundDialogComponent', () => {
  let component: ResultsFoundDialogComponent;
  let fixture: ComponentFixture<ResultsFoundDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [ResultsFoundDialogComponent]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsFoundDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should set the `payload` to a stringified version of our form values', () => {
    component.data = found;

    // Deselect the second competitor

    // Fire the dialog close

    // Check the retruned data
    expect(component.data).toEqual([comp1, comp3]);
  });
});

