
import { NgStyle } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";
import { FlexModule } from "@ngbracket/ngx-layout/flex";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Nations } from "app/events/model/nations";
import { UserDataService } from "app/user/user-data.service";
import firebase from "firebase/compat/app";
import { Subscription } from 'rxjs';
import { ToolbarComponent } from "../shared/components/toolbar.component";
import { UserData } from 'app/user/user';
import { ControlCardTypes } from 'app/events/model/oevent';

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
    private dialog: MatDialog,
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

  }
  
  canDeactivate(): boolean {
    return !this.userForm.dirty;
  }
}
