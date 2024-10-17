import { NgModule } from '@angular/core';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from "./about.component";
import { AboutItemComponent } from './about-item.component';
import { PrivacyPolicyComponent } from './privacy-policy.component';


@NgModule({
    imports: [
        AboutRoutingModule,
        AboutComponent,
        AboutItemComponent,
        PrivacyPolicyComponent
    ]
})
export class AboutModule { }
