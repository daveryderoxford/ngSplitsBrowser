import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CourseClass } from 'app/results/model';

@Component({
    selector: 'app-class-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatListModule],
    templateUrl: './class-list.html',
    styleUrl: './class-list.scss'
})
export class ClassList {

  classes = input.required<CourseClass[]>();
  selectedClass = input.required<CourseClass>();
  selected = output<CourseClass>()
}
