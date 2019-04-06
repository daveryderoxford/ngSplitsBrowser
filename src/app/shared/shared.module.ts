
/** Shared componens and services  */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppMaterialModule } from "./app-material.module";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SpinnerModule } from './components/spinner.module';
import { DialogsModule } from "./dialogs/dialogs.module";
import { AngularFireAuth } from "@angular/fire/auth";
import { AppRoutingModule } from "../app-routing.module";
import { AngularSplitModule } from 'angular-split';

@NgModule({
    imports: [
        CommonModule,
        DialogsModule,
        SpinnerModule,
        AppMaterialModule,
        AppRoutingModule,
        AngularSplitModule.forRoot()
    ],
    declarations: [NavbarComponent],
    exports: [
        SpinnerModule,
        DialogsModule,
        AppMaterialModule,
        NavbarComponent,
        AngularSplitModule
    ],
    providers: [AngularFireAuth]
})
export class SharedModule { }
