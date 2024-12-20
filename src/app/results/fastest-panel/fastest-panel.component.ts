import { Component, computed, input, signal } from '@angular/core';
import { Results } from '../model/results';
import { Course } from '../model/course';
import { CourseClass } from '../model/course-class';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormatTimePipe } from '../model/results-pipes';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-fastest-panel',
    imports: [MatButtonToggleModule, MatCardModule, FormatTimePipe],
    templateUrl: './fastest-panel.component.html',
    styleUrl: './fastest-panel.component.scss'
})
export class FastestPanelComponent {

  private MaxFastestSplits = 10;

  results = input.required<Results>();
  leg = input<number>(0);
  course = input.required<Course>();
  selectedClass = input.required<CourseClass>();

  startCode = computed(() => this.leg() === 0? '' : this.course()?.getControlCode(this.leg() - 1));

  endCode = computed(() => this.leg() === 0 ? '' : this.course()?.getControlCode(this.leg()));

  fastestSplitsForLeg = computed(() => 
    this.results().getFastestSplitsForLeg(this.startCode(), this.endCode()));

  fastestSplitsForClass = computed(() =>
    this.selectedClass().getFastestSplitTo(this.leg()));

}