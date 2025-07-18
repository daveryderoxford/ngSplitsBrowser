import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Competitor, Course, CourseClass } from 'app/results/model';
import { ResultsDataService } from 'app/results/results-data.service ';

export type SearchSelectedItem = Competitor | CourseClass | Course;

interface FilterPanelGroup {
   name: string;
   options: SearchSelectedItem[];
}

@Component({
   selector: 'app-results-search-dialog',
   standalone: true,
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [
      CommonModule,
      ReactiveFormsModule,
      MatOptionModule,
      MatListModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatDialogModule,
      MatButtonModule
   ],
   templateUrl: './results-search-dialog.html',
   styleUrl: './results-search-dialog.scss'
})
export class ResultsSearchDialog {
   private rd = inject(ResultsDataService);
   protected dialogRef = inject(MatDialogRef<ResultsSearchDialog>);

   searchControl: FormControl = new FormControl('');

   seachText = toSignal(this.searchControl.valueChanges, { initialValue: '' });

   protected searchResults = computed(() => this.searchPanelContents(this.seachText()));

   private searchPanelContents(value: string | SearchSelectedItem | null): FilterPanelGroup[] {
      const results = this.rd.results();
      if (!results) {
         return [];
      }

      let filterText = '';
      if (typeof value === 'string') {
         filterText = value;
      } else if (value && typeof value === 'object' && 'name' in value) {
         filterText = (value as SearchSelectedItem).name;
      }
      // If value is null or an unexpected type, filterText remains ''

      const classes = results.findCourseClasss(filterText);
      const competitors = results.findCompetitors(filterText);

      let filterPanelContents = [];

      if (classes && classes.length > 0) {
         filterPanelContents.push({ name: 'Classes', options: classes });
      }
      if (competitors && competitors.length > 0) {
         filterPanelContents.push({ name: 'Results', options: competitors });
      }
      return filterPanelContents;
   }

   optionSelected(val: SearchSelectedItem) {
      console.log('Search Dialog: Item selected ' + val.name);
      this.searchControl.setValue('');
      this.dialogRef.close(val); // Close dialog and return selected item
   }

   displayFn(value?: SearchSelectedItem): string | undefined {
      return value ? value.name : undefined;
   }

   isCompetitor = (option: SearchSelectedItem): boolean => (option instanceof Competitor);
   asCompetitor = (option: SearchSelectedItem): Competitor => (option as Competitor);

}