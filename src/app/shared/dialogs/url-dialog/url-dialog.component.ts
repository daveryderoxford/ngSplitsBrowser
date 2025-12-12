import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-url-dialog',
  template: `
    <h1 mat-dialog-title>Load Results from URL</h1>
    <div mat-dialog-content>
      <p>Enter the URL of the SI-HTML results page.</p>
      <mat-form-field>
        <mat-label>URL</mat-label>
        <input matInput [(ngModel)]="url" cdkFocusInitial>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button [mat-dialog-close]="url" [disabled]="!url">Load</button>
    </div>
  `,
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrlDialogComponent {
  dialogRef = inject(MatDialogRef<UrlDialogComponent>);
  url: string;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
