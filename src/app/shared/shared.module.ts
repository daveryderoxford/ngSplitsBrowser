
/** Shared componens and services  */
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularSplitModule } from 'angular-split';
import { AppMaterialModule } from "./app-material.module";
import { SidenavButtonComponent } from './components/sidenav-button/sidenav-button.component';
import { SpinnerModule } from './components/spinner/spinner.module';
import { DialogsModule } from "./dialogs/dialogs.module";

@NgModule({
    imports: [
        CommonModule,
        DialogsModule,
        SpinnerModule,
        AppMaterialModule,
        AngularSplitModule.forRoot(),
    ],
    declarations: [
        SidenavButtonComponent
    ],
    exports: [
        CommonModule,
        AngularFireAuthModule,
        SpinnerModule,
        DialogsModule,
        AppMaterialModule,
        SidenavButtonComponent,
        AngularSplitModule
    ],
})
export class SharedModule { }
