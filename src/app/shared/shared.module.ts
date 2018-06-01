
/** Shared componens and services  */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppMaterialModule } from "./app-material.module";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SpinnerModule } from './components/spinner.module';
import { DialogsModule } from "./dialogs/dialogs.module";
import { PaganationService } from "./services/paganation.service";
import { AngularFireAuth } from "angularfire2/auth";
import { AppRoutingModule } from "app/app-routing.module";

@NgModule({
    imports: [
        CommonModule,
        DialogsModule,
        SpinnerModule,
        AppMaterialModule,
        AppRoutingModule,
    ],
    declarations: [NavbarComponent],
    exports: [
        SpinnerModule,
        DialogsModule,
        AppMaterialModule,
        NavbarComponent,
    ],
    providers: [AngularFireAuth]
})
export class SharedModule { }
