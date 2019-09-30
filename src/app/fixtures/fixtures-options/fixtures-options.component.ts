import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FixtureFilter, FixtureTimeFilter, GradeFilter } from 'app/model/fixture-filter';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { GradeFilterComponent } from '../grade-filter-dialog/grade-filter-dialog.component';

@Component({
   selector: 'app-fixtures-options',
   templateUrl: './fixtures-options.component.html',
   styleUrls: ['./fixtures-options.component.scss']
})
export class FixturesOptionsComponent implements OnInit {

   timeFilter$: BehaviorSubject<FixtureTimeFilter>;
   gradeOptions$: BehaviorSubject<GradeFilter[]>;

   @Input() postcode: string;
   @Input() filter: FixtureFilter;

   @Output() postcodeChanged = new EventEmitter<string>();
   @Output() filterChanged = new EventEmitter<FixtureFilter>();

   postcodeFormControl: FormControl;
   gradesEnabledControl: FormControl;

   constructor(public dialog: MatDialog) { }

   ngOnInit() {
      this.postcodeFormControl = new FormControl(this.postcode, [this.validatePostcode, Validators.required]);
      this.gradesEnabledControl = new FormControl(this.filter.gradesEnabled);

      this.timeFilter$ = new BehaviorSubject(this.filter.time);
      this.gradeOptions$ = new BehaviorSubject(this.filter.grades);

      combineLatest([
         this.timeFilter$,
         this.gradesEnabledControl.valueChanges.pipe(startWith(this.filter.gradesEnabled)),
         this.gradeOptions$]).subscribe(([time, gradeEnabled, gradeOptions]) => {
            const filter = {
               time: time,
               gradesEnabled: gradeEnabled,
               grades: gradeOptions
            };
            this.filterChanged.emit(filter);
         });
   }

   postcodeEntered() {

      if (!this.postcodeFormControl.valid) {
         return;
      }
      const portcode = this.postcodeFormControl.value.trim().toUpperCase();
      this.postcodeChanged.emit(portcode);
   }

   validatePostcode(input: FormControl) {
      const text = input.value.trim();

      if (text === "") {
         return null;
      }
      const regex = /^[A-Z]{1,2}([0-9]{1,2}|[0-9][A-Z])\s*[0-9][A-Z]{2}$/gi;

      return regex.test(text) ? null : { postcodeInvalid: true };
   }

   timeFilterChanged(val: FixtureTimeFilter) {
      this.timeFilter$.next(val);
   }

   displayGrades() {
      // Display grade dialog

      const dialogRef = this.dialog.open(GradeFilterComponent, {
         width: '320px',
         maxWidth: '100vw',
         data: this.gradeOptions$.value,
         panelClass: 'sb-highzorder-dialog'
      });

      dialogRef.afterClosed().subscribe(gradeFilter => {
         if (gradeFilter) {
            this.gradeOptions$.next(gradeFilter);
         }
      });
   }
}
