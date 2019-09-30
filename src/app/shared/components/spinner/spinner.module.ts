import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import {MatCommonModule} from '@angular/material/core';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SpinnerComponent } from './spinner.component';

@NgModule({
    imports: [CommonModule, MatCommonModule, MatProgressSpinnerModule],
    declarations: [SpinnerComponent],
    exports: [SpinnerComponent],
})
export class SpinnerModule { }
