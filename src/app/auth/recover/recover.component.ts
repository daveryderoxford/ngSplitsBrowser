import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements OnInit {
  recoverForm: FormGroup;
  error: string;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.recoverForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.error = '';
  }

  async recover() {
    const auth = this.afAuth.auth;
    const emailAddress = this.recoverForm.get('email').value;

    this.error = '';

    try {
      await auth.sendPasswordResetEmail(emailAddress);
    } catch (err) {
      console.log('RecoverComponent: Error requesting password reset for email');
      this.error = 'Error requesting password reset for email;'
    }
  }
}
