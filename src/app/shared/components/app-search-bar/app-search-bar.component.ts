import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './app-search-bar.component.html',
  styleUrls: ['./app-search-bar.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('true', style({ width: '*' })),
      state('false', style({ width: '0' })),
      transition('true => false', animate('300ms ease-in')),
      transition('false => true', animate('300ms ease-out'))
    ])
  ]
})
export class SearchBarComponent {

  @ViewChild('input') inputElement: ElementRef;

  @Output() blur = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<void>();
  @Output() onEnter = new EventEmitter<string>();
  @Output() onFocus = new EventEmitter<string>();
  @Output() onOpen = new EventEmitter<void>();

  searchVisible = false;

  public close(): void {
    this.searchVisible = false;
    this.inputElement.nativeElement.value = '';
    this.onClose.emit();
  }

  public open(): void {
    this.searchVisible = true;
    this.inputElement.nativeElement.focus();
    this.onOpen.emit();
  }

  onBlurring(searchValue: string) {
    if (!searchValue) {
      this.searchVisible = false;
    }
    this.blur.emit(searchValue);
  }

  onEnterring(searchValue: string) {
    this.onEnter.emit(searchValue);
  }

  onFocussing(searchValue: string) {
    this.onFocus.emit(searchValue);
  }
}
