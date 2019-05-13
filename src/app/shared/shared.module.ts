
/** Shared componens and services  */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppMaterialModule } from "./app-material.module";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SpinnerModule } from './components/spinner.module';
import { DialogsModule } from "./dialogs/dialogs.module";
import { AppRoutingModule } from "../app-routing.module";
import { AngularSplitModule } from 'angular-split';
import { AngularFireAuthModule } from "@angular/fire/auth";

@NgModule({
    imports: [
        CommonModule,
        DialogsModule,
        SpinnerModule,
        AppMaterialModule,
        AppRoutingModule,
        AngularSplitModule.forRoot(),
    ],
    declarations: [
        NavbarComponent
    ],
    exports: [
        CommonModule,
        AngularFireAuthModule,
        SpinnerModule,
        DialogsModule,
        AppMaterialModule,
        NavbarComponent,
        AngularSplitModule
    ],
})
export class SharedModule { }
