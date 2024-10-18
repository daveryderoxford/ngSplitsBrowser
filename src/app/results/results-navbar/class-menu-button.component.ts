import { Component, OnInit, OnChanges, input, output } from '@angular/core';
import { CourseClass } from 'app/results/model';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-class-menu-button',
    
        template: `
<button mat-button [matMenuTriggerFor]="classPicker">
  {{ buttonText }}
  <mat-icon>arrow_drop_down</mat-icon>
</button>
<mat-menu #classPicker="matMenu">
  @for (oclass of oclasses(); track oclass) {
    <button mat-menu-item (click)="select.emit(oclass)">
      {{oclass.name}}
    </button>
  }
</mat-menu>
`,
    standalone: true,
    imports: [MatButtonModule, MatMenuModule, MatIconModule]
})
export class ClassMenuButtonComponent implements OnInit, OnChanges {

   oclasses = input<CourseClass[]>();
   selectedClass = input<CourseClass>();
   select = output<CourseClass>();

   buttonText: string;

   ngOnInit() { }

   ngOnChanges() {
      if (this.selectedClass()) {
         this.buttonText = this.selectedClass()!.name;
      } else {
         this.buttonText = 'Class';
      }
   }
}
