import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "app/shared/shared.module";

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from "./about.component";
import { AboutItemComponent } from './about-item.component';
import { PrivacyPolicyComponent } from './privacy-policy.component';


@NgModule({
  declarations: [
    AboutComponent,
    AboutItemComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AboutRoutingModule,
  ]
})
export class AboutModule { }
