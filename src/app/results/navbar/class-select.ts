import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CourseClass } from 'app/results/model';

@Component({
  selector: 'app-class-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, FormsModule],
  template: ` 
    <mat-form-field appearance="outline" subscriptSizing="dynamic" class="dense-form-field set-width">
      <mat-label>Class</mat-label>
      <mat-select [value]="this.selected()" (selectionChange)="onSelected.emit($event.value)">
        @for (oclass of oclasses(); track oclass.name) {
          <mat-option [value]="oclass">
            {{ oclass.name }}
          </mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    .set-width {
      width: 130px; 
      min-width: 110px;
    }
  `]
})
export class ClassSelect {

  selected = input.required<CourseClass>();

  onSelected = output<CourseClass>();

  oclasses = input<CourseClass[]>();

}
