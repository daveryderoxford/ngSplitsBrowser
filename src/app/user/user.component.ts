import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

    userForm: FormGroup;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private afAuth: AngularFireAuth) {

        this.userForm = this.formBuilder.group({
            club: [''],
            nationality: [''],
            nationalId: ['', ],
        });

    }



    changePassoword() {

    }

}



