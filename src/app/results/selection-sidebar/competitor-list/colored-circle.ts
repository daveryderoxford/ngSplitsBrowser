import { ChangeDetectionStrategy, Component, computed, input, viewChild } from '@angular/core';

@Component({
   selector: 'app-colored-circle',
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
   <svg [attr.width]="diameter()" [attr.height]="diameter()">
      <circle r="50%" cx="50%" cy="50%" [attr.fill]="color()" />
      <text x="50%" y="50%" text-anchor="middle"  dy=".3em" >
         {{text()}}
      </text>
   </svg>
   `,
})
export class ColoredCircle {
   diameter = input('20px');
   color = input<string>();
   text = input<string>('');
}

