import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-postcode',
  templateUrl: './postcode.component.html',
  styleUrls: ['./postcode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostcodeComponent implements OnInit {

  constructor() { }

  @Input() postcode: string;
  @Output() postcodeChanged = new EventEmitter<string>();

  postcodeFormControl: FormControl;

  ngOnInit() {
    this.postcodeFormControl = new FormControl<string>( this.postcode, [this.validatePostcode, Validators.required] );
  }

  postcodeEntered() {

    if ( !this.postcodeFormControl.valid ) {
      return;
    }
    const portcode = this.postcodeFormControl.value.trim().toUpperCase();
    this.postcodeChanged.emit( portcode );
  }

  validatePostcode( input: FormControl ) {
    const text = input.value.trim();

    if ( text === "" ) {
      return null;
    }
    const regex = /^[A-Z]{1,2}([0-9]{1,2}|[0-9][A-Z])\s*[0-9][A-Z]{2}$/gi;

    return regex.test( text ) ? null : { postcodeInvalid: true };
  }

}
