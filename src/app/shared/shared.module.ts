
/** Shared componens and services  */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppMaterialModule } from "./app-material.module";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SpinnerModule } from './components/spinner.module';
import { DialogsModule } from "./dialogs/dialogs.module";
import { AngularFireAuth } from "angularfire2/auth";
import { AppRoutingModule } from "../app-routing.module";
import { MatSearchBarComponent } from "./components/mat-search-bar/mat-search-bar.component";

@NgModule({
    imports: [
        CommonModule,
        DialogsModule,
        SpinnerModule,
        AppMaterialModule,
        AppRoutingModule,
    ],
    declarations: [NavbarComponent, MatSearchBarComponent],
    exports: [
        SpinnerModule,
        DialogsModule,
        AppMaterialModule,
        NavbarComponent,
        MatSearchBarComponent,
    ],
    providers: [AngularFireAuth]
})
export class SharedModule { }
