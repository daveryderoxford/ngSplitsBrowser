import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { FullUserData } from 'app/model/user';
import { Nations, Nation } from 'app/model/nations';
import { Observable } from 'rxjs/Observable';
import { UserDataService } from 'app/user/user-data.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    userForm: FormGroup;
    error = '';

    showProgressBar = false;

    filteredNations: Observable<Nation[]>;

    constructor(
        private formBuilder: FormBuilder,
        private afAuth: AngularFireAuth,
        private router: Router,
        private userdata: UserDataService ) {

        this.userForm = this.formBuilder.group({
            firstName: [''],
            lastName: [''],
            yearOfBirth: ['', [ Validators.min(1900),  Validators.max(new Date().getFullYear()) ] ],
            club: [''],
            nationality: [''],
            nationalId: [''],
            ecardSI: [''],
            ecardEmit: [''],
            autoFind: ['']
        });
    }

    ngOnInit() {

        // monitor login/out
        this.afAuth.authState.subscribe( (loggedIn) => this.loginChanged(loggedIn) );

       this.userdata.getUser().subscribe( (userData) => this.userChanged(userData));

        this.filteredNations = this.userForm.get('nationality').valueChanges
            .startWith(null)
            .map(val => val ? this.filterNations(val) : Nations.getNations().slice());
    }

    async loginChanged(loggedIn: firebase.User) {
       if (!loggedIn) {
           this.router.navigate(['/']);
       }
    }

    userChanged(userData) {
       this.userForm.reset(userData);
    }

    private filterNations(name: string): Nation[] {
        const ret = Nations.getNations().filter(nation => new RegExp(`^${name}`, 'gi').test(nation.fullname));
        return (ret);
    }

    async save() {
        this.userdata.updateDetails(this.userForm.value);
    }

    changePassoword() {

    }

}



