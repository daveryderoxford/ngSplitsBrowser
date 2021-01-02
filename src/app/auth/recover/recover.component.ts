import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
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
    const emailAddress = this.recoverForm.get('email').value;

    this.error = '';

    try {
      await this.afAuth.sendPasswordResetEmail(emailAddress);
    } catch (err) {
      console.log('RecoverComponent: Error requesting password reset for email');
      this.error = 'Error requesting password reset for email';
    }
  }
}
