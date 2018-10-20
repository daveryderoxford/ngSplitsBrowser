import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    error: string;

    constructor(private router: Router,
        private formBuilder: FormBuilder,
        private afAuth: AngularFireAuth) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.error = '';
    }

    async login() {
        if (this.loginForm.valid) {
            this.error = '';
            try {
                await this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.value.email,
                    this.loginForm.value.password);
                this.postSignIn();
            } catch (err) {
                this.signinError(err);
            }
        }
    }

    async loginWithGoogle() {
        await this.signIn(new firebase.auth.GoogleAuthProvider());
        this.postSignIn();
    }

    async loginWithFacebook() {
        await this.signIn(new firebase.auth.FacebookAuthProvider());
        this.postSignIn();
    }

    private async signIn(provider: firebase.auth.AuthProvider): Promise<any> {
        this.error = '';
        try {
            await this.afAuth.auth.signInWithPopup(provider);
        } catch (err) {
            this.signinError(err);
        }
    }

    private signinError(err) {
        console.log('LoginComponent: Error loging in' + err);
        this.error = 'Login attempt failed';
    }

    private postSignIn() {
       console.log('LoginComponent: Successful login');
        this.router.navigate(['/']);
    }

}



