import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {  MatIconModule } from '@angular/material/icon';
import { SelectionSidebarService } from './selection-sidebar.service';

@Component({
  selector: 'app-selection-sidebar-button',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button mat-icon-button (click)='this.ss.toggle()'>
      @if (ss.isOpen()) {
        <mat-icon>chevron_left</mat-icon>
      } @else {
        <mat-icon>chevron_right</mat-icon>
      }
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionSidebarButton {
  ss = inject(SelectionSidebarService); 
}
