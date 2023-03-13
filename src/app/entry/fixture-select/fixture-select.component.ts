import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { FixturesService } from 'app/fixtures/fixtures.service';
import { Fixture } from 'app/model';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component( {
  selector: 'app-fixture-select',
  templateUrl: './fixture-select.component.html',
  styleUrls: ['./fixture-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class FixtureSelectComponent implements OnInit {

  fixtures$: Observable<Fixture[]>;
  filter: FormControl;
  filter$: Observable<string>;

  multiselect = false;
  initialFilter ="";
  
  constructor ( public fs: FixturesService, 
    public dialogRef: MatDialogRef<FixtureSelectComponent, Fixture[]>,
    @Inject( MAT_DIALOG_DATA ) public data: { multiselect: boolean, initialFilter: string } ) { }


  ngOnInit(): void {
    this.multiselect = this.data.multiselect;

    this.filter = new FormControl( this.data.initialFilter );
    this.filter$ = this.filter.valueChanges.pipe( startWith( this.data.initialFilter ) );

    this.fixtures$ = combineLatest( [this.fs.allFixtues(), this.filter$] ).pipe(
      map( ( [fixtures, filter] ) => this._filterFixtures( fixtures, filter ) )
    );

  }

  private _filterFixtures( fixtures: Fixture[], filter: string ): Fixture[] {
    const str = filter.trim().toLowerCase();
    if ( str === "" ) {
      return fixtures
    } else {
      const filtered = fixtures.filter( fixture => {
        return fixture.club.toLowerCase().includes( str ) ||
          fixture.name.toLowerCase().includes( str ) ||
          fixture.area.toLowerCase().includes( str );
      } );
      return filtered;
    }
  }

  onSubmit( options: SelectionModel<MatListOption> ) {
    this.dialogRef.close( options.selected.map( opt => opt.value as Fixture ));
  }

}
