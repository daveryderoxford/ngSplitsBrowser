import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Fixture } from 'app/model';
import { FormControl, Validators } from '@angular/forms';

@Component( {
   selector: 'app-fixtures-options',
   templateUrl: './fixtures-options.component.html',
   styleUrls: [ './fixtures-options.component.scss' ]
} )
export class FixturesOptionsComponent implements OnInit {

   @Input() postcode;

   @Output() postcodeChanged = new EventEmitter<string>();

   postcodeFormControl: FormControl;

   constructor () { }

   ngOnInit() {
      this.postcodeFormControl = new FormControl( '', [ this.validatePostcode, Validators.required ] );
   }

   postcodeEntered() {

      if ( !this.postcodeFormControl.valid) {
         return;
      }

      this.postcodeChanged.emit( this.postcodeFormControl.value );
   }

   validatePostcode( input: FormControl ) {
      let text = input.value;
      text = text.replace( /\s/g, "" );
      const regex = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;
      return regex.test( text ) ? null : { postcodeInvalid: true };
   }
}
