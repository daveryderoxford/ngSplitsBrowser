
import { Component, effect, OnInit } from "@angular/core";
import { Auth, authState, User } from '@angular/fire/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";
import { FlexModule } from "@ngbracket/ngx-layout/flex";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserData } from 'app/user/user';
import { UserDataService } from "app/user/user-data.service";
import { ToolbarComponent } from "../shared/components/toolbar.component";
import { Nations } from "app/events/model/nations";
import { FormContainerComponent } from 'app/shared/components/form-container/form-container.component';

@UntilDestroy()
@Component({
    selector: "app-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.scss"],
    standalone: true,
    imports: [ToolbarComponent, FlexModule, FormContainerComponent, ReactiveFormsModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatIconModule, MatCheckboxModule]
})
export class UserComponent implements OnInit {

  userForm = new FormGroup({
    firstname: new FormControl('', { validators: [Validators.required] }),
    surname: new FormControl('', { validators: [Validators.required] }),
    club: new FormControl('', { validators: [Validators.minLength(2), Validators.maxLength(10)] }),
    nationality: new FormControl('', { validators: [Validators.required] }),
    nationalId: new FormControl('', { validators: [Validators.required] }),
  });

  showProgressBar = false;
  busy = false;

  nations = Nations.getNations();

  constructor(
    private afAuth: Auth,
    private router: Router,
    private usd: UserDataService,
  ) {
    effect(() => {
      const userData = usd.user();
      if (userData) {
        this.userForm.reset();
        this.userForm.patchValue(userData);
      };
    });
  }

  ngOnInit() {
    authState(this.afAuth)
      .pipe(untilDestroyed(this))
      .subscribe(loggedIn => this.loginChanged(loggedIn as User));
  }

  loginChanged(loggedIn: User) {
    if (!loggedIn) {
      this.router.navigate(["/"]);
    }
  }

  async save() {

    this.busy = true;
    try {
      await this.usd.updateDetails(this.userForm.value as Partial<UserData>);
      console.log('UserComponnet: User results saved');
    } finally {
      this.busy = false;
      this.router.navigate(["/"]);
    }
  }

  canDeactivate(): boolean {
    return !this.userForm.dirty;
  }
}
