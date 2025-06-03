import { Component, computed, input, signal } from '@angular/core';
import { Results } from '../model/results';
import { Course } from '../model/course';
import { CourseClass } from '../model/course-class';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormatTimePipe } from '../model/results-pipes';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-fastest-panel',
    imports: [MatButtonToggleModule, MatCardModule ],
    template: `
      <div class="chartPopup" style="position: absolute; left: 496px; top: 278.5px;">
    <div class="chartPopupHeader">
   <span>Fastest leg - time 152 to 153 </span>
</div>
<div class="chartPopupTableContainer">
   <table>
      
      <tr>
         <td>01: 47 < /td>
         <td>Yellow</td>
         <td>Gregg Lippiatt < /td>
      </tr>
      <tr>
         <td>02: 11 < /td>
         <td>W10A</td>
         <td>Delyth Darlington < /td>
      </tr>
      <tr>
         <td>02: 11 < /td>
         <td>M12B</td>
         <td>Matthew Kelly < /td>
      </tr>
      <tr class="highlighted">
         <td>03:06 < /td>
         <td>M10A</td>
         <td>Jack Kelsey < /td>
      </tr>
   </table>
</div>
</div>;

    `,
    styleUrl: './fastest-panel.component.scss'
})
export class ChartPopup {


   const header = computed((() => 'Fastest Leg - Time ' + this.legIndex() + ' to ' + (this.legIndex() + 1)))
}

