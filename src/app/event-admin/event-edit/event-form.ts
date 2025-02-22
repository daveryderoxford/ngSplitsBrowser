import { AsyncPipe } from '@angular/common';
import { Component, computed, effect, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlexModule } from '@ngbracket/ngx-layout';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Club } from 'app/events/model/club';
import { Nations } from 'app/events/model/nations';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EventService } from '../../events/event.service';
import { EventDisciplines, EventGrades, EventInfo, EventTypes, OEvent } from '../../events/model/oevent';

@UntilDestroy()
@Component({
   selector: 'app-event-form',
   templateUrl: './event-form.html',
   styleUrls: ['./event-form.scss'],
   imports: [
      FlexModule,
      ReactiveFormsModule,
      AsyncPipe,
      MatFormFieldModule,
      MatInputModule,
      MatOptionModule,
      MatSelectModule,
      MatProgressBarModule,
      MatAutocompleteModule,
      MatDatepickerModule,
      MatButtonModule
   ],
   providers: [provideNativeDateAdapter()]
})
export class EventForm implements OnInit {
   private formBuilder = inject(FormBuilder);
   private es = inject(EventService);
   public snackBar = inject(MatSnackBar);

   oevent = input<OEvent | null>();
   submitted = output<Partial<OEvent>>();

   eventSubmitted = output<EventInfo>();

   new = computed(() => this.oevent() === null);

   grades = EventGrades.grades;
   nations = Nations.getNations();
   types = EventTypes.types;
   disciplines = EventDisciplines.disciplines;

   clubs: Club[] = [];
   filteredClubs$: Observable<Club[]>;

   form = this.formBuilder.group({
      name: ["", Validators.required],
      date: ["", Validators.required],
      nationality: ["", Validators.required],
      club: ["", Validators.required],
      grade: ["", Validators.required],
      type: ["", Validators.required],
      discipline: ["", Validators.required],
      webpage: ["", Validators.pattern(/((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/i)]
   });

   constructor() {
      effect(() => {
         if (this.oevent()) {
            this.form.patchValue(this.oevent()!);
         }
      });
   }

   ngOnInit() {

      this.filteredClubs$ = combineLatest([this.es.getClubs(),
      this.form.controls.club.valueChanges.pipe(startWith('')),
      this.form.controls.nationality.valueChanges.pipe(startWith(''))])
         .pipe(
            map(([clubs, name, nat]) => this.filterClubs(clubs, name, nat))
         ).pipe(untilDestroyed(this));

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

   displayClub(club?: Club): string {
      return club ? club.name : undefined;
   }

   private addhttp(url: string | null): string | null {
      if (url) {
         if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
         }
      }
      return url;
   }

   submit() {
      const output = this.form.getRawValue() as Partial<OEvent>;
      output.webpage = this.addhttp(output.webpage);

      this.submitted.emit(output);
      this.form.reset();
   }

   public canDeactivate(): boolean {
      return !this.form.dirty;
   }
}
