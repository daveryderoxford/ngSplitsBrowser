import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { FilterPipeModuleModule } from './fixture-pipes';
import { FixturesGridComponent } from './fixtures-grid/fixtures-grid.component';
import { FixturesMapComponent } from './fixtures-map/fixtures-map.component';
import { FixtureWeekFilterComponent } from './fixtures-options/fixture-week-filter.component';
import { FixturesOptionsComponent } from './fixtures-options/fixtures-options.component';
import { FixturesRoutingModule } from './fixtures-routing.module';
import { FixturesComponent } from './fixtures/fixtures.component';
import { GradeFilterComponent } from './grade-filter-dialog/grade-filter-dialog.component';

@NgModule({
  declarations: [
    FixturesMapComponent,
    FixturesGridComponent,
    FixturesComponent,
    FixturesOptionsComponent,
    GradeFilterComponent,
    FixtureWeekFilterComponent,
  ],
  entryComponents: [
    GradeFilterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    HttpClientModule,
    FilterPipeModuleModule,
    FixturesRoutingModule
  ],
  exports: [
    GradeFilterComponent
  ]
})
export class FixturesModule { }