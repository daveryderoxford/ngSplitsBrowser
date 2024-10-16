
import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatDialog as MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EventService } from "app/events/event.service";
import { ControlCardTypes, UserData } from "app/model";
import { Nations } from "app/model/nations";
import { UserResult } from "app/model/user";
import { ResultsSelectionService } from "app/results/results-selection.service";
import { DialogsService, Utils } from "app/shared";
import { ResultsFoundDialogComponent } from "app/user/results-found-dialog/results-found-dialog.component";
import { UserDataService } from "app/user/user-data.service";
import firebase from "firebase/compat/app";
import isEqual from 'lodash/isequal';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { NgStyle } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { FlexModule } from "@ngbracket/ngx-layout/flex";
import { ToolbarComponent } from "../shared/components/toolbar.component";

@UntilDestroy()
@Component({
    selector: "app-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.scss"],
    standalone: true,
    imports: [ToolbarComponent, FlexModule, MatCardModule, ReactiveFormsModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatIconModule, NgStyle, MatCheckboxModule]
})
export class UserComponent implements OnInit {
  originalUserData: UserData = null;
  userForm: UntypedFormGroup;
  ecardTypes = ControlCardTypes.types;

  error = "";
  subscription: Subscription;

  showProgressBar = false;
  busy = false;

  nations = Nations.getNations();

  cardclass: "mat-card-mobile";

  constructor (
    private formBuilder: UntypedFormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private usd: UserDataService,
    private rs: ResultsSelectionService,
    private es: EventService,
    private dialog: MatDialog,
    private dialogService: DialogsService
  ) {
    this.userForm = this.formBuilder.group( {
      firstname: [""],
      surname: [""],
      club: ["", [Validators.minLength( 2 ), Validators.maxLength( 10 )]],
      nationality: [""],
      postcode: [""],
      nationalId: [""],
      autoFind: [""],
      ecards: this.formBuilder.array( [] ) as UntypedFormArray
    } );
  }

  ngOnInit() {
    this.afAuth.authState
         .pipe( untilDestroyed(this))
         .subscribe( loggedIn => this.loginChanged( loggedIn ) );

    this.usd.user$
          .pipe( untilDestroyed( this ) )
          .subscribe( userData => this.userChanged( userData ) );
  }

  private _ecardsControl(): UntypedFormArray {
    return this.userForm.controls['ecards'] as UntypedFormArray;
  }

  loginChanged( loggedIn: firebase.User ) {
    if ( !loggedIn ) {
      this.router.navigate( ["/"] );
    }
  }

  private userChanged( userData: UserData ) {
    this.originalUserData = userData;
    if ( userData ) {

      // Clear form by removing ecards and resetting
      this.userForm.setControl( 'ecards', new UntypedFormArray( [] ) );
      this.userForm.reset();

      this.userForm.setValue( {
        firstname: userData.firstname,
        surname: userData.surname,
        club: userData.club,
        nationality: userData.nationality,
        postcode: userData.postcode,
        nationalId: userData.nationalId,
        autoFind: userData.autoFind,
        ecards: [],
      } );

      for ( const ecard of userData.ecards ) {
        this._ecardsControl().push( this._createEcard( ecard.id, ecard.type ) );
      }
    }
  }

  private _createEcard( id: string, type: string ): UntypedFormGroup {
    return this.formBuilder.group( {
      id: [id, [Validators.required, Validators.pattern( "[0-9]+")]],
      type: [type, [Validators.required]]
    } );
  }

  addEcard(): void {
    this._ecardsControl().push( this._createEcard( '', '' ) );

    // Need to explicitly mark the form as diirty as removing an element in code does not mark it as dirty.
    this.userForm.markAsDirty();
  }

  removeEcard( i: number ) {
    // remove address from the list
    this._ecardsControl().removeAt( i );

    // Need to explicitly mark the form as diirty as removing an element in code does not mark it as dirty.
    this.userForm.markAsDirty();

  }

  ecardControls() {
    return this.userForm.get( 'ecards' )['controls'];
  }

 async save() {

    const updatedUserData: UserData = null;

   this.busy = true;
 
    /*
    .pipe(
      tap( userData => updatedUserData = userData ),
      switchMap( () => this.findUserResults( updatedUserData ) ),
      map( foundResults => this.removeAlreadyInUserResults( foundResults, updatedUserData.results ) ),
      switchMap( ( foundResults ) => this.selectResultsToSave( foundResults ) ),
      switchMap( selectedResults => this.saveCompetitorResults( selectedResults ) )
    )*/
  }

  /** Returns found results that are not already in the users results based on ecardId and type  */
  removeAlreadyInUserResults( foundResults: UserResult[], allResults: UserResult[] ): UserResult[] {

    for ( const userResult of allResults ) {
      foundResults = foundResults.filter( found => {
        const duplicate =
          userResult.event.key === found.event.key &&
          userResult.ecardId === found.ecardId;
        return !duplicate;
      } );
    }
    return ( foundResults );
  }

  /** Saves all competitor results emiting a value when all have been saved. */
  saveCompetitorResults( userResults: UserResult[] ): Observable<void> {
    const requests: Observable<void>[] = [];
    for ( const found of userResults ) {
      requests.push( this.usd.addResult( found ) );
    }

    return forkJoin( requests ).pipe( map( () => { } ) );
  }

  /** Displays dialog with user results found and returns the results the user has selected */
  selectResultsToSave( foundResults: UserResult[] ): Observable<UserResult[]> {
    if ( foundResults.length > 0 ) {
      const dialogRef = this.dialog.open( ResultsFoundDialogComponent, { width: '300px', data: foundResults } );
      return dialogRef.afterClosed();
    } else {
      return of( [] );
    }
  }
  
  canDeactivate(): boolean {
    return !this.userForm.dirty;
  }
}
