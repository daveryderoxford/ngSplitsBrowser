import { Component, OnInit, inject } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { ToolbarComponent } from 'app/shared/components/toolbar.component';

@Component({
  selector: 'app-recover',
  templateUrl: './recover-password.html',
  styleUrls: ['./recover-password.scss'],
  imports: [FlexModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, ToolbarComponent]
})
export class RecoverComponent {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private afAuth = inject(Auth);
  private snackBar = inject(MatSnackBar);

  recoverForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async recover() {
    const emailAddress = this.recoverForm.get('email')!.value!;

    try {
      await sendPasswordResetEmail(this.afAuth, emailAddress);
      this.router.navigate(["/auth/login"]);
    } catch (err) {
      console.log('RecoverComponent: Error requesting password reset for email');
      this.snackBar.open('Error requesting password reset for email', 'Close', { duration: 3000 });
    }
  }
}
