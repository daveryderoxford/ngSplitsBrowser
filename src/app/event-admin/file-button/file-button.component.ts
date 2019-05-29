import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from "@angular/core";

@Component({
  // tslint:disable-next-line:component-selector
  "selector": "file-button",
  "template": `
        <span>
        <input [accept]="accept" [multiple]="multiple" type="file" (change)="onNativeInputFileSelect($event)" #inputFile hidden />
        <button type="button" mat-raised-button color=primary (click)="selectFile()">
          {{label}}
        </button>
    </span>`
})

export class FileButtonComponent {
  @Input() accept: string;
  @Input() multiple = false;
  @Input() label = "Select file";
  @Output() onFileSelect = new EventEmitter<File[]>();

  @ViewChild("inputFile", { static: true }) nativeInputFile: ElementRef;

  private _files: File[];

  get fileCount(): number { return this._files && this._files.length || 0; }

  onNativeInputFileSelect($event) {
    this._files = $event.srcElement.files;
    this.onFileSelect.emit(this._files);
  }

  selectFile() {
    this.nativeInputFile.nativeElement.click();
  }
}
