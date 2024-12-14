import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CourseClass } from 'app/results/model';

@Component({
  selector: 'app-class-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule],
  templateUrl: './class-list.html',
  styleUrl: './class-list.scss'
})
export class ClassList {

  classes = input.required<CourseClass[]>();
  selectedClass = input.required<CourseClass>();
  hasCourses = input.required<boolean>();
  selected = output<CourseClass>()

  
}
