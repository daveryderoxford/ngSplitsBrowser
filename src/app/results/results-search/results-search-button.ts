import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Competitor, Course, CourseClass } from 'app/results/model';
import { ResultsSelectionService } from 'app/results/results-selection.service';
import { ResultsSearchDialog, SearchSelectedItem } from './results-search-dialog/results-search-dialog';

@Component({
  selector: 'app-results-search-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <button mat-icon-button (click)="openSearchDialog()" aria-label="Open search dialog">
      <mat-icon>search</mat-icon>
    </button>
  `,
})
export class SearchIconButtonComponent {
  private dialog = inject(MatDialog);
  private rs = inject(ResultsSelectionService);

  openSearchDialog(): void {
    const dialogRef = this.dialog.open(ResultsSearchDialog, {
      width: '420px', 
      height: '80%',
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result: SearchSelectedItem | undefined) => {
      if (result) {
        console.log('ResultsSearch: Selected item: ', result.name);
        this.updateSelections(result);
      } 
    });
  }

  private updateSelections(selection: SearchSelectedItem): void {
    if (selection instanceof Competitor) {
      this.rs.selectCompetitors(selection);
      this.rs.selectClass(selection.courseClass);
      // this.rs.selectCourse(selection.courseClass.course); 
    } else if (selection instanceof CourseClass) {
      this.rs.selectClass(selection);
      // this.rs.selectCourse(selection.course); 
    } else if (selection instanceof Course) {
      // this.rs.selectCourse(selection); 
      if (selection.classes && selection.classes.length > 0) {
        this.rs.selectClass(selection.classes[0]);
      }
    }
  }
}