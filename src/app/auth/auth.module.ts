import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginComponent } from "./login/login.component";
import { RecoverComponent } from "./recover/recover.component";
import { SignupComponent } from "./signup/signup.component";

@NgModule({
  declarations: [
    LoginComponent,
    RecoverComponent,
    SignupComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AuthRoutingModule,
  ],
  exports: [
    LoginComponent,
    RecoverComponent,
    SignupComponent,
    ChangePasswordComponent,
  ]
})
export class AuthModule { }


