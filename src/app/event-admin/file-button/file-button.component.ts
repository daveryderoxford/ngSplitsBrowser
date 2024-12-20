import { Component, ElementRef, input, output, viewChild } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "file-button",
    template: `
        <span>
        <input [accept]="accept()" [multiple]="multiple()" type="file" (change)="onNativeInputFileSelect($event)" #inputFile hidden />
        <button type="button" mat-raised-button [disabled]=disabled() (click)="selectFile()">
          {{label()}}
        </button>
    </span>`,
    imports: [MatButtonModule]
})

export class FileButtonComponent {
  accept = input<string>();
  multiple = input(false);
  label = input("Select file");
  disabled = input(false);
  fileSelected = output<File[]>();

  nativeInputFile = viewChild<ElementRef>("inputFile");

  private _files: File[];

  get fileCount(): number { return this._files && this._files.length || 0; }

  onNativeInputFileSelect($event: any) {
    this._files = $event.srcElement.files;
    this.fileSelected.emit(this._files);
  }

  selectFile() {
    this.nativeInputFile().nativeElement.click();
  }
}
