
/** Shared componens and services  */
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularSplitModule } from 'angular-split';
import { AppMaterialModule } from "./components/material/app-material.module";
import { SidenavButtonComponent } from './components/sidenav-button.component';
import { SpinnerModule } from './components/spinner/spinner.module';
import { ToolbarComponent } from './components/toolbar.component';
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
        SidenavButtonComponent,
        ToolbarComponent,
    ],
    exports: [
        CommonModule,
        AngularFireAuthModule,
        SpinnerModule,
        DialogsModule,
        AppMaterialModule,
        SidenavButtonComponent,
        ToolbarComponent,
        AngularSplitModule
    ],
})
export class SharedModule { }
