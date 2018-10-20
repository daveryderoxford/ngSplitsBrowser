import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { EventService } from "app/events/event.service";
import { ControlCardTypes, UserData } from "app/model";
import { Nations } from "app/model/nations";
import { Utils, DialogsService } from "app/shared";
import { ResultsFoundDialogComponent } from "app/user/results-found-dialog/results-found-dialog.component";
import { UserDataService } from "app/user/user-data.service";
import { map, switchMap, tap, catchError } from "rxjs/operators";
import { ResultsSelectionService } from "app/results/results-selection.service";
import { UserResult } from "app/model/user";
import * as _ from 'lodash';
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit {
  originalUserData: UserData = null;
  userForm: FormGroup;
  ecardTypes = ControlCardTypes.types;

  error = "";

  showProgressBar = false;
  busy = false;

  nations = Nations.getNations();

  constructor(
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private usd: UserDataService,
    private rs: ResultsSelectionService,
    private es: EventService,
    private dialog: MatDialog,
    private dialogService: DialogsService
  ) {
    this.userForm = this.formBuilder.group({
      firstname: [""],
      surname: [""],
      club: [""],
      nationality: [""],
      nationalId: [""],
      autoFind: [""],
      ecards: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.afAuth.authState.subscribe(loggedIn => this.loginChanged(loggedIn));
    this.usd.userData().subscribe(userData => this.userChanged(userData));
  }

  private _ecardsControl(): FormArray {
    return this.userForm.controls['ecards'] as FormArray;
  }

  loginChanged(loggedIn: firebase.User) {
    if (!loggedIn) {
      this.router.navigate(["/"]);
    }
  }

  private userChanged(userData: UserData) {
    this.originalUserData = userData;
    if (userData) {

      // Clear form by removing ecards and resetting
      this.userForm.setControl('ecards', new FormArray([]));
      this.userForm.reset();

      this.userForm.setValue({
        firstname: userData.firstname,
        surname: userData.surname,
        club: userData.club,
        nationality: userData.nationality,
        nationalId: userData.nationalId,
        autoFind: userData.autoFind,
        ecards: [],
      });

      for (const ecard of userData.ecards) {
        this._ecardsControl().push(this._createEcard(ecard.id, ecard.type));
      }
    }
  }

  private _createEcard(id: string, type: string): FormGroup {
    return this.formBuilder.group({
      id: id,
      type: type,
    });
  }

  addEcard(): void {
    this._ecardsControl().push(this._createEcard('', ''));
  }

  removeEcard(i: number) {
    // remove address from the list
    this._ecardsControl().removeAt(i);
  }


  async save() {

    let updatedUserData: UserData = null;

    this.busy = true;

    this.usd.updateDetails(this.userForm.value).pipe(
      tap(userData => updatedUserData = userData),
      switchMap(() => this.findUserResults(updatedUserData)),
      map(foundResults => this.removeAlreadyInUserResults(foundResults, updatedUserData.results)),
      switchMap((foundResults) => this.selectResultsToSave(foundResults)),
      switchMap(selectedResults => this.saveCompetitorResults(selectedResults))
    ).subscribe(
      () => {
        console.log('UserComponnet: User results saved');
      },
      (err) => {
        console.log('UserComponnet: Error encountered saving user results' + err.message);
        this.dialogService.message('Error saving user results', 'Error saving user results');
      },
      () => {
        this.busy = false;
      }
    );
  }

  /** Returns found results that are not alreday in the users results based on ecardId and type  */
  removeAlreadyInUserResults(foundResults: UserResult[], allResults: UserResult[]): UserResult[] {

    for (const userResult of allResults) {
      foundResults = foundResults.filter(found => {
        const duplicate =
          userResult.event.key === found.event.key &&
          userResult.ecardId === found.ecardId;
        return !duplicate;
      });
    }
    return (foundResults);
  }

  /** Saves all competitor results emiting a value when all have been saved. */
  saveCompetitorResults(userResults: UserResult[]): Observable<void> {
    const requests: Observable<void>[] = [];
    for (const found of userResults) {
      requests.push(this.usd.addResult(found));
    }

    return Observable.forkJoin(requests).map(() => { });
  }

  /** Displays dialog with user results found and returns the results the user has selected */
  selectResultsToSave(foundResults: UserResult[]): Observable<UserResult[]> {
    if (foundResults.length > 0) {
      const dialogRef = this.dialog.open(ResultsFoundDialogComponent, { width: '300px', data: foundResults });
      return dialogRef.afterClosed();
    } else {
      return Observable.of([]);
    }
  }

  /** Finds results based on any unchanged field.
   *  Matches based on ecard
   */
  async findUserResults(updatedUser: UserData): Promise<UserResult[]> {
    const originalUser = this.originalUserData;
    let resultsFound: Array<UserResult> = [];

    // Find results for any ecards that have changed.
    for (const ecard of updatedUser.ecards) {
      if (!originalUser || !originalUser.ecards.find(origEcard => _.isEqual(ecard, origEcard))) {
        resultsFound = resultsFound.concat(await this.usd.findUserResults(ecard));
      }
    }

    /** TO DO do we want to search by ecard as well?
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
    Utils.removeDuplicates(resultsFound);

    return resultsFound;
  }

  canDeactivate(): boolean {
    return !this.userForm.dirty;
  }
}
