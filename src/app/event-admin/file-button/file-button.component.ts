import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from "@angular/core";

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    "selector": "file-button",
    "template": `
        <span>
        <input [accept]="accept" [multiple]="multiple" type="file" (change)="onNativeInputFileSelect($event)" #inputFile hidden />
        <button type="button" mat-raised-button color=primary (click)="selectFile()">
          {{label}}
        </button>
    </span>`,
    standalone: true
})

export class FileButtonComponent {
  @Input() accept: string;
  @Input() multiple = false;
  @Input() label = "Select file";
  @Output() fileSelected = new EventEmitter<File[]>();

  @ViewChild("inputFile") nativeInputFile: ElementRef;

  private _files: File[];

  get fileCount(): number { return this._files && this._files.length || 0; }

  onNativeInputFileSelect($event) {
    this._files = $event.srcElement.files;
    this.fileSelected.emit(this._files);
  }

  selectFile() {
    this.nativeInputFile.nativeElement.click();
  }
}
