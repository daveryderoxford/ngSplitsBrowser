import { Component, computed, HostBinding, inject, input, linkedSignal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { CourseClass } from '../model';
import { ResultsDataService } from '../results-data.service ';
import { ResultsSelectionService } from '../results-selection.service';
import { ClassList } from './class-list/class-list';
import { CompetitorList } from './competitor-list/competitor-list';
import { SelectionSidebarService } from './selection-sidebar.service';
import { ResultsPageState } from '../results-page-state';

@Component({
  selector: 'app-sidebar',
  imports: [MatTabsModule, MatIconModule, MatButtonModule, CompetitorList, ClassList],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  host: {
    '[class.shown]': 'this.ss.isOpen()',
    '[class.hidden]': '!this.ss.isOpen()',
  }
})
export class Sidebar {

  protected rs = inject(ResultsSelectionService);
  protected rd = inject(ResultsDataService);
  protected ss = inject(SelectionSidebarService);
  protected ps = inject(ResultsPageState);
 
  view = input.required<string>();

  tabs = viewChild(MatTabGroup);

  tablabel = computed(() => this.rs.courseOrClass ? 'Course' : 'Class');

  tabIndex = linkedSignal({
    source: this.rs.oclass,
    computation: () => 1
  });

  selectClass(oclass: CourseClass) {
    this.rs.selectClass(oclass);
  }
}
