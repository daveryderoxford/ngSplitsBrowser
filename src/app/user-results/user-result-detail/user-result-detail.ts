import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserResult } from 'app/user-results/user-result';
import { TimeUtilities } from 'app/results/model';
import { differenceInSeconds } from 'date-fns';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { DialogsService } from 'app/shared/dialogs/dialogs.service';
import { UserDataService } from 'app/user/user-data.service';

@Component({
  selector: 'app-user-result-detail',
  standalone: true,
  imports: [DatePipe, MatIconModule, MatTooltipModule, MatButtonModule],
  templateUrl: './user-result-detail.html',
  styleUrls: ['./user-result-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserResultDetailComponent {
  private router = inject(Router);
  private dialogs = inject(DialogsService);
  private userService = inject(UserDataService);

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
      const minsPerKm = (ur.totalTime / 60 / this.courseLength()).toFixed(1);
      return minsPerKm + 'mins/km';
    }
  });

  behind = computed(() => {
    const ur = this.userResult();
    if (!ur.totalTime || !ur.oclass.winningTime) {
      return 'N/A';
    }
    const diff = ur.totalTime - ur.oclass.winningTime;
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

  async viewResults(): Promise<void> {
    const eventKey = this.userResult().eventKey;
    await this.router.navigate(['/results', 'graph', eventKey]);
  }

  async deleteResult(): Promise<void> {
    const res = this.userResult();
    const confirmed = await this.dialogs.confirm(
      'Delete Result',
      `Are you sure you want to delete your result for ${res.event.name}?`
    );

    if (confirmed) {
      await this.userService.deleteResult(res);
    }
  }

  formatTime = (t: number) => TimeUtilities.formatTime(t);
}