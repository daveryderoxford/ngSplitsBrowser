
import { Component} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
   selector: 'app-search-button',
   template: `
      <div class="search-container" [class.hasValue]="hasValue" >
         <mat-form-field floatLabel="never">
            <input matInput type = "search" [(ngModel)]="term" placeholder="Search&hellip;" 
                        autocomplete="off" (blur)="hasValue=term?true:false" >
         </mat-form-field>
         <button type="button" class="searchIcon" mat-icon-button (click)="hasValue=!hasValue">
            @if (hasValue) {
               <mat-icon (click)="term=''" class="mat-18 ;">close</mat-icon>
            } @else {
               <mat-icon class="mat-18">search</mat-icon>
            }
         </button>
      </div>;
`,
   standalone: true,
   imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
   styles: `
   .search-container{
      max-width: 500px;
      .mat-form-field{
      font-size:14px;
      line-height: 0.9em;
      -webkit-transition: width 0.4s ease-in-out;
      transition: width 0.4s ease-in-out;
      width: 0px;
      }
   }

   .hasValue{
      .mat-form-field{
         width: 300px;
      }
      .searchIcon{
         background:#e2e9eb;
      }
   }
    `,
})
export class SearchButton  {
   term: string;
   hasValue: boolean;
}


