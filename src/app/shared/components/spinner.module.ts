import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import {MatCommonModule} from '@angular/material/core';
import { MatProgressSpinnerModule } from "@angular/material";
import { SpinnerComponent } from './spinner.component';
import { FormContainerComponent } from './form-container/form-container.component';

@NgModule({
    imports: [CommonModule, MatCommonModule, MatProgressSpinnerModule],
    declarations: [SpinnerComponent, FormContainerComponent],
    exports: [SpinnerComponent],
})
export class SpinnerModule { }
