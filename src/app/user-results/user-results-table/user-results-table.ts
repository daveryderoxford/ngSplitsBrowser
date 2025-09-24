import { ChangeDetectionStrategy, Component, input, signal } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { DatePipe } from '@angular/common';
import { UserResult } from 'app/user-results/user-result';
import { TimeUtilities } from 'app/results/model';
import { MatIconModule } from "@angular/material/icon";
import { UserResultDetailComponent } from "app/user-results/user-result-detail/user-result-detail";
import { MatButtonModule } from "@angular/material/button";

@Component({
   selector: "app-user-results-table",
   templateUrl: "./user-results-table.html",
   styleUrls: ["./user-results-table.scss"],
   imports: [MatTableModule, DatePipe, MatIconModule, UserResultDetailComponent, MatButtonModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
   standalone: true,
})
export class UserResultsTableComponent {
   userResults = input.required<UserResult[]>();

   expandedElement = signal<UserResult | undefined>(undefined);

   isExpanded(element: UserResult): boolean {
      return this.expandedElement() === element;
   }

   toggle(element: UserResult): void {
      this.expandedElement.set(this.isExpanded(element) ? undefined : element);
   }

   readonly displayedColumns = ['name', 'date', 'course', 'position', 'behind', 'expandbutton'];

   behind(r1: number, r2: number): string {
      return TimeUtilities.formatTime(r1 - r2);
   }
}