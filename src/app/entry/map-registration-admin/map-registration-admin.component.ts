import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { Course } from 'app/results/model';

@Component({
  selector: 'app-map-registration-admin',
  templateUrl: './map-registration-admin.component.html',
  styleUrls: ['./map-registration-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapRegistrationAdminComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  @ViewChild( "MatChipList", { static: true } ) matChipList: MatChipList ;

  courses = [];

  constructor() { }

  ngOnInit() {

    this.matChipList.chipSelectionChanges.subscribe( (evt) => {
        // If chip was selected display edit dialog
    });
  }

  /** Add Course via dialog */
  add( event: MatChipInputEvent ): void {
    const input = event.input;
    const value = event.value;

    // Show courses dialog to add course

    if ( ( value || '' ).trim() ) {
      this.courses.push( { name: value.trim() } );
    }

    if ( input ) {
      input.value = '';
    }
  }

  remove( course: Course ): void {
    const index = this.courses.indexOf( course );

    if ( index >= 0 ) {
      this.courses.splice( index, 1 );
    }
  }

}
