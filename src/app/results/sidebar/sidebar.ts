import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { CompetitorList } from './competitor-list/competitor-list';
import { ClassList } from './class-list/class-list';
import { ResultsDataService } from '../results-data.service ';
import { ResultsSelectionService } from '../results-selection.service';
import { CourseClass } from '../model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatTabsModule, CompetitorList, ClassList],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit {

  rs = inject(ResultsSelectionService);
  rd = inject(ResultsDataService);

  tabs = viewChild(MatTabGroup);

  ngOnInit() {
    if (this.rs.oclass()) {
      this.tabs().selectedIndex = 2;
    }
  }

  selectClass(oclass: CourseClass) {
    this.rs.selectClass(oclass);
    this.tabs().selectedIndex = 2;
  }

  // hasCourses = input.required<boolean>();

}
