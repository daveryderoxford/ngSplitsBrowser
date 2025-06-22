import { Component } from "@angular/core";
import { versions } from 'environments/versions';
import { RouterLink } from "@angular/router";
import { AboutItem } from "./about-item";
import { MatExpansionModule } from "@angular/material/expansion";
import { FlexModule } from "@ngbracket/ngx-layout/flex";
import { ToolbarComponent } from "../shared/components/toolbar.component";

@Component({
    selector: "app-about",
    templateUrl: "./about-page.html",
    styleUrls: ["./about-page.scss"],
    imports: [ToolbarComponent, FlexModule, MatExpansionModule, AboutItem, RouterLink]
})
export class AboutComponent {
  ver = versions;
}
