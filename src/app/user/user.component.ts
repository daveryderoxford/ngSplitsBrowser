
import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EventService } from "app/events/event.service";
import { FixturesService } from "app/fixtures/fixtures.service";
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

@UntilDestroy()
@Component( {
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
} )
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
    private fs: FixturesService, 
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
   try {
   await this.usd.updateDetails( this.userForm.value );
   console.log( 'UserComponnet: User results saved' );
   this.fs.updatePostcode( this.userForm.value.postcode );
   } finally {
      this.busy = false;
   }
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

  /** Finds results based on any unchanged field.
   *  Matches based on ecard
   */
  async findUserResults( updatedUser: UserData ): Promise<UserResult[]> {
    const originalUser = this.originalUserData;
    let resultsFound: Array<UserResult> = [];

    // Find results for any ecards that have changed.
    for ( const ecard of updatedUser.ecards ) {
      if ( !originalUser || !originalUser.ecards.find( origEcard => isEqual( ecard, origEcard ) ) ) {
        resultsFound = resultsFound.concat( await this.usd.findUserResults( ecard ) );
      }
    }

    /** TO DO do we want to search by name as well?
    if (
      !originalUser ||
      originalUser.firstName !== updatedUser.firstName ||
      originalUser.lastName !== updatedUser.lastName ||
      originalUser.club !== updatedUser.club
    ) {
      resultsFound = resultsFound.concat(
        await this.cds.searchResultsByName(
          updatedUser.firstName,
          updatedUser.lastName,
          updatedUser.club
        )
      );
    } */

    // Remove duplicated from found results as may have been found for ecard and name
    Utils.removeDuplicates( resultsFound );

    return resultsFound;
  }

  canDeactivate(): boolean {
    return !this.userForm.dirty;
  }
}
