import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { Nations } from "app/model/nations";
import { UserDataService } from "app/user/user-data.service";
import * as firebase from "firebase/app";
import { UserData } from "app/model";

@Component({
    selector: "app-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit {

    originalData: UserData = null;
    userForm: FormGroup;
    error = "";

    showProgressBar = false;

    nations = Nations.getNations();

    constructor(
        private formBuilder: FormBuilder,
        private afAuth: AngularFireAuth,
        private router: Router,
        private userdata: UserDataService) {

        this.userForm = this.formBuilder.group({
            firstName: [""],
            lastName: [""],
            yearOfBirth: ["", [Validators.min(1900), Validators.max(new Date().getFullYear())]],
            club: [""],
            nationality: [""],
            nationalId: [""],
            ecardSI: [""],
            ecardEmit: [""],
            autoFind: [""]
        });
    }

    ngOnInit() {

        // monitor login/out
        this.afAuth.authState.subscribe((loggedIn) => this.loginChanged(loggedIn));

        this.userdata.getUser().subscribe((userData) => this.userChanged(userData));

        const t = this.userForm.controls["ecardEmit"].value;

    }

    async loginChanged(loggedIn: firebase.User) {
        if (!loggedIn) {
            this.router.navigate(["/"]);
        }
    }

    userChanged(userData) {
        this.originalData = userData;
        this.userForm.reset(userData);
    }

    async save() {
       const  controls = this.userForm.controls;
       const orig = this.originalData; 
        if (this.originalData.ecardEmit !== this.userForm.controls["ecardEmit"].value ) {

        }

   

        this.userdata.updateDetails(this.userForm.value);
    }

    createECard(): FormGroup {
        return this.formBuilder.group({
          id: '',
          type: '',
        });
      }

    addEcard() {
    }

    removeECard() {

    }
}
