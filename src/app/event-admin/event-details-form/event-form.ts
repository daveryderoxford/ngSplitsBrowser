import { Component, computed, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateFnsAdapter, MAT_DATE_FNS_FORMATS, provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlexModule } from '@ngbracket/ngx-layout';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Club } from 'app/events/model/club';
import { Nations } from 'app/events/model/nations';
import { startOfDay } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { EventService } from '../../events/event.service';
import { EventDisciplines, EventGrades, EventTypes, OEvent } from '../../events/model/oevent';

@UntilDestroy()
@Component({
   selector: 'app-event-form',
   templateUrl: './event-form.html',
   styleUrls: ['./event-form.scss'],
   imports: [
      FlexModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatOptionModule,
      MatSelectModule,
      MatProgressBarModule,
      MatAutocompleteModule,
      MatDatepickerModule,
      MatButtonModule
   ],
   providers: [
      { provide: MAT_DATE_LOCALE, useValue: enGB },
      { provide: DateAdapter, useClass: DateFnsAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS },
      provideDateFnsAdapter(),
   ],
})
export class EventDetailsForm  {
   private es = inject(EventService);
   public snackBar = inject(MatSnackBar);

   oevent = input<OEvent | null>();
   submitted = output<Partial<OEvent>>();

   grades = EventGrades.grades;
   nations = Nations.getNations();
   types = EventTypes.types;
   disciplines = EventDisciplines.disciplines;

   today = startOfDay(new Date());

   form = new FormGroup({
      name: new FormControl('', Validators.required),
      date: new FormControl<Date>(this.today, Validators.required),
      nationality: new FormControl('', Validators.required),
      club: new FormControl('', Validators.required),
      grade: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      discipline: new FormControl('', Validators.required),
      webpage: new FormControl('', Validators.pattern(/((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/i))
   });

   clubFormValue = toSignal(this.form.controls.club.valueChanges, {initialValue: ''});
   natFormValue = toSignal(this.form.controls.nationality.valueChanges, {initialValue: ''});
   allClubs = toSignal(this.es.getClubs(), {initialValue: []});
   filteredClubs = computed(() => filterClubs(this.allClubs(), this.clubFormValue(), this.natFormValue()));

   constructor() {
      effect(() => {
         if (this.oevent()) {
            this.form.patchValue(this.oevent()!);
         }
      });
   }

   submit() {
      const output = this.form.getRawValue() as Partial<OEvent>;
      output.webpage = addhttp(output.webpage);
      output.club = output.club.toLocaleUpperCase();

      this.submitted.emit(output);
      this.form.reset();
   }

   public canDeactivate(): boolean {
      return !this.form.dirty;
   }
}

function filterClubs(clubs: Club[], enteredText: string, nat: string): Club[] {

   const ret = clubs.filter(club => {
      const natOK = !nat || nat === '' || club.nationality === nat;
      const clubOK = !enteredText || club.name.startsWith(enteredText.toUpperCase());
      return natOK && clubOK;
   });

   ret.sort((a, b) => a.name.localeCompare(b.name));

   return ret;
}

function addhttp(url: string | null): string | null {
   if (url) {
      if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
         url = "http://" + url;
      }
   }
   return url;
}