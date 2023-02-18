import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { FilterPipeModuleModule } from './fixture-pipes';
import { FixturesGridComponent } from './fixtures-grid/fixtures-grid.component';
import { FixturesMapComponent } from './fixtures-map/fixtures-map.component';
import { FixtureWeekFilterComponent } from './fixtures-options/fixture-week-filter.component';
import { FixturesOptionsComponent } from './fixtures-options/fixtures-options.component';
import { FixturesComponent } from './fixtures/fixtures.component';
import { GradeFilterComponent } from './grade-filter-dialog/grade-filter-dialog.component';
import { FixtureKeyComponent } from './fixtures-map/fixture-key.component';
import { FixtureActionsComponent } from './fixture-actions/fixture-actions.component';
import { PostcodeComponent } from './postcode/postcode.component';
import { AddToGoogleCalendarButtonComponent } from './fixture-actions/google-cal-button';

@NgModule({
  declarations: [
    FixturesMapComponent,
    FixturesGridComponent,
    FixturesComponent,
    FixturesOptionsComponent,
    GradeFilterComponent,
    FixtureWeekFilterComponent,
    FixtureKeyComponent,
    FixtureActionsComponent,
    PostcodeComponent,
    AddToGoogleCalendarButtonComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FilterPipeModuleModule,
  ],
  exports: [
    GradeFilterComponent
  ]
})
export class FixturesModule { }
