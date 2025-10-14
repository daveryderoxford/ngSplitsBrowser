import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserAdminService } from './user-admin.service';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Toolbar } from "app/shared/components/toolbar";

@Component({
  selector: 'app-user-list',
  styleUrl: './user-list.component.scss',
  standalone: true,
  imports: [MatListModule, MatProgressSpinnerModule, Toolbar],
  template: `
    <app-toolbar title="User Admin" style="grid-area: toolbar"/>

    @switch (uas.status()) {
      @case ('loading') {
        <span>loading <mat-spinner diameter="20"></mat-spinner></span>
      }
      @case ('error') {
        <div class="alert alert-danger">
          <p>Error loading users:</p>
          <pre>{{ uas.error()?.message }}</pre>
        </div>
      }
      @case ('resolved') {
        <mat-list>
          @for (user of uas.users(); track user.key) {
            <mat-list-item>
              <div matListItemTitle>{{ user.firstname }} {{ user.surname }} - {{user.nationality}} - {{user.club}}</div>
              <div matListItemLine>Email: {{ user.email }} </div>
              <div matListItemLine>UID: {{user.key }}</div>
            </mat-list-item>
            <mat-divider/>
          } @empty {
            <p>No users found.</p>
          }
        </mat-list>
      }
    } `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  protected uas = inject(UserAdminService);

  constructor() {
    this.uas.load();
  }
}