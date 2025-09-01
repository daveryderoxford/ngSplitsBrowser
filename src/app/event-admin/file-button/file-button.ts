import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "file-button",
    template: `
        <span>
        <input [accept]="accept()" [multiple]="multiple()" type="file" (change)="onNativeInputFileSelect($event)" #inputFile hidden />
        @if (label() ==="") {
        <button type="button" mat-icon-button [disabled]=disabled() (click)="selectFile()">
          <mat-icon>upload</mat-icon>
        </button>
        } @else {
          <button type="button" matButton="tonal" [disabled]=disabled() (click)="selectFile()">
            <mat-icon>upload</mat-icon>
            {{label()}}
        </button>
        }
    </span>`,
    imports: [MatButtonModule, MatIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush 
})

export class FileButton {
  accept = input<string>('');
  multiple = input(false);
  label = input('');
  disabled = input(false);
  fileSelected = output<File[]>();

  nativeInputFile = viewChild.required<ElementRef>("inputFile");

  onNativeInputFileSelect($event: any) {
    const files = $event.srcElement.files;
    this.fileSelected.emit(files);
  }

  selectFile() {
    this.nativeInputFile().nativeElement.click();
  }
}
