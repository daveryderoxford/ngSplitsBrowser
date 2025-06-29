import { Component } from "@angular/core";
import { versions } from 'environments/versions';
import { AboutItem } from "./about-item";
import { MatExpansionModule } from "@angular/material/expansion";
import { FlexModule } from "@ngbracket/ngx-layout/flex";
import { Toolbar } from "../shared/components/toolbar";

@Component({
    selector: "app-about",
    templateUrl: "./about-page.html",
    styleUrls: ["./about-page.scss"],
    imports: [Toolbar, FlexModule, MatExpansionModule, AboutItem]
})
export class AboutComponent {
  ver = versions;
}
