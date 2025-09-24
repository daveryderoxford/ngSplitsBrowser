import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { UserResult } from 'app/user-results/user-result';
import { TimeUtilities } from 'app/results/model';
import { differenceInSeconds } from 'date-fns';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-result-detail',
  standalone: true,
  imports: [DatePipe, MatIconModule, MatTooltipModule],
  templateUrl: './user-result-detail.html',
  styleUrls: ['./user-result-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserResultDetailComponent {
  userResult = input.required<UserResult>();

  private courseDetails = computed(() => {
    const ur = this.userResult();
    return ur.course;
  });

  courseLength = computed(() => this.courseDetails()?.distance);

  totalTime = computed(() => {
    const ur = this.userResult();
    return (ur.totalTime) ? 'Time: ' + TimeUtilities.formatTime(ur.totalTime) : '';
  });


  minsPerKm = computed(() => {
    const ur = this.userResult();

    if (!ur.totalTime || this.courseLength() === 0) {
      return '';
    } else {
      const minsPerKm = (ur.totalTime / 60 / this.courseLength()).toFixed(2);
      return minsPerKm + 'mins/km';
    }
  });

  behind = computed(() => {
    const ur = this.userResult();
    if (!ur.totalTime || !ur.course.winningTime) {
      return 'N/A';
    }
    const diff = differenceInSeconds(ur.totalTime, ur.course.winningTime);
    return TimeUtilities.formatTime(diff) + 'behind';
  });

  gradeIcon = computed(() => {
    // Placeholder logic for grade icon
    return 'military_tech';
  });

  typeIcon = computed(() => {
    // Placeholder logic for type icon
    return 'emoji_events';
  });
}