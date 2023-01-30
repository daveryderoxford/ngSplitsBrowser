import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UntypedFormControl } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FixtureFilter, FixtureTimeFilter } from 'app/model/fixture-filter';
import { LoginSnackbarService } from 'app/shared/services/login-snackbar.service';
import { GradeFilterComponent } from '../grade-filter-dialog/grade-filter-dialog.component';

@UntilDestroy( { checkProperties: true } )
@Component( {
   selector: 'app-fixtures-options',
   templateUrl: './fixtures-options.component.html',
   styleUrls: ['./fixtures-options.component.scss']
} )
export class FixturesOptionsComponent implements OnInit {

   outputFilter: FixtureFilter;

   @Input()
   set filter( f: FixtureFilter ) {
      this.outputFilter = Object.assign( f );
   }

   @Output() filterChanged = new EventEmitter<FixtureFilter>();

   gradesEnabledControl: UntypedFormControl;

   constructor ( private dialog: MatDialog,
      private auth: AngularFireAuth,
      private loginSnackBar: LoginSnackbarService ) { }

   ngOnInit() {
      this.gradesEnabledControl = new UntypedFormControl( this.outputFilter.gradesEnabled );

      this.gradesEnabledControl.valueChanges.subscribe( ( val ) => {
         this.outputFilter.gradesEnabled = val;
         this.filterChanged.emit( this.outputFilter );
      } );
   }

   async likeClicked( event: MatButtonToggleChange ) {
      if ( ! (await this.auth.currentUser) ) {
         this.loginSnackBar.open( "Must be logged in to filter liked events" );
         return;
      }
      this.outputFilter.likedOnly = event.source.checked;
      this.filterChanged.emit( this.outputFilter );
   }

   timeFilterChanged( val: FixtureTimeFilter ) {
      this.outputFilter.time = val;
      this.filterChanged.emit( this.outputFilter );
   }

   displayGrades() {
      // Display grade dialog

      const dialogRef = this.dialog.open( GradeFilterComponent, {
         width: '320px',
         maxWidth: '100vw',
         maxHeight: '100vh',
         data: this.outputFilter.grades,
         panelClass: 'sb-highzorder-dialog'
      } );

      dialogRef.afterClosed().subscribe( gradeFilter => {
         if ( gradeFilter ) {
            this.outputFilter.grades = gradeFilter;
            this.filterChanged.emit( this.outputFilter );
         }
      } );
   }
}
