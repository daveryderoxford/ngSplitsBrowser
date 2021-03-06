import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about.component';
import { PrivacyPolicyComponent } from './privacy-policy.component';

const routes: Routes = [
  { path: "", component: AboutComponent },
  { path: "privacy", component: PrivacyPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
