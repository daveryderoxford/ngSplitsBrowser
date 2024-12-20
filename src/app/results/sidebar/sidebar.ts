import { Component, computed, inject, linkedSignal, OnInit, signal, viewChild } from '@angular/core';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { CompetitorList } from './competitor-list/competitor-list';
import { ClassList } from './class-list/class-list';
import { ResultsDataService } from '../results-data.service ';
import { ResultsSelectionService } from '../results-selection.service';
import { CourseClass } from '../model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-sidebar',
    imports: [MatTabsModule, CompetitorList, ClassList],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss'
})
export class Sidebar {

  rs = inject(ResultsSelectionService);
  rd = inject(ResultsDataService);

  tabs = viewChild(MatTabGroup);

  tablabel = computed( () => this.rs.courseOrClass ? 'Course' : 'Class');

 // tabIndex = linkedSignal(() => this.rs.oclass() ? 1 : 0 );
 tabIndex = signal(0);

  selectClass(oclass: CourseClass) {
    this.rs.selectClass(oclass);
    this.tabIndex.set(1);
  }

}
