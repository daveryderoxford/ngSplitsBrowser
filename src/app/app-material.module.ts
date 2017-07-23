
/** Material components used for mail app  */
import { NgModule } from '@angular/core';

import {
  MdAutocompleteModule, MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule,
  MdChipsModule, MdCoreModule, MdDatepickerModule, MdDialogModule, MdGridListModule, MdIconModule,
  MdInputModule, MdListModule, MdMenuModule, MdNativeDateModule, MdProgressBarModule, MdRadioModule,
  MdProgressSpinnerModule, MdRippleModule, MdSelectModule, MdSidenavModule, MdSliderModule,
  MdSlideToggleModule, MdSnackBarModule, MdTabsModule, MdToolbarModule, MdTooltipModule, MdTableModule, MdPaginatorModule, MdExpansionModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk';

@NgModule({
  exports: [
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdChipsModule,
    MdCoreModule,
    MdDatepickerModule,
    MdDialogModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdNativeDateModule,
    MdProgressBarModule,
    MdRadioModule,
    MdProgressSpinnerModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    MdTableModule,
    MdPaginatorModule,
    CdkTableModule,
    MdExpansionModule,
  ],
})
export class AppMaterialModule { }
