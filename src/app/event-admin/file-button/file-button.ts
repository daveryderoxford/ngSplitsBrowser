/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Component, ElementRef, input, output, viewChild } from "@angular/core";
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
    imports: [MatButtonModule, MatIconModule]
})

export class FileButton {
  accept = input<string>();
  multiple = input(false);
  label = input("");
  disabled = input(false);
  fileSelected = output<File[]>();

  nativeInputFile = viewChild.required<ElementRef>("inputFile");

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
