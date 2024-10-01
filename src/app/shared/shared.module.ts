
/** Shared componens and services  */
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularSplitModule } from 'angular-split';

import { SidenavButtonComponent } from './components/sidenav-button.component';

import { ToolbarComponent } from './components/toolbar.component';


@NgModule({
    imports: [
    CommonModule,
    AngularSplitModule.forRoot(),
    SidenavButtonComponent,
    ToolbarComponent
],
    exports: [
    CommonModule,
    AngularFireAuthModule,
    SidenavButtonComponent,
    ToolbarComponent,
    AngularSplitModule
]
})
export class SharedModule { }
