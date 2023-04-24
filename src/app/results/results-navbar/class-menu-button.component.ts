import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CourseClass } from 'app/results/model';

@Component({
   selector: 'app-class-menu-button',
   template: `
<button mat-button [matMenuTriggerFor]="classPicker">
    {{ buttonText }}
     <mat-icon>arrow_drop_down</mat-icon>
</button>
<mat-menu #classPicker="matMenu">
  <button mat-menu-item *ngFor="let oclass of oclasses" (click)="select.emit(oclass)">
    {{oclass.name}}
  </button>
</mat-menu>
  `,
})
export class ClassMenuButtonComponent implements OnInit, OnChanges {

   @Input() oclasses: CourseClass[];
   @Input() selectedClass: CourseClass;
   @Output() select = new EventEmitter<CourseClass>();

   buttonText: string;

   constructor() { }

   ngOnInit() { }

   ngOnChanges() {
      if (this.selectedClass) {
         this.buttonText = this.selectedClass.name;
      } else {
         this.buttonText = 'Class';
      }
   }
}
