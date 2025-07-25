import { ChangeDetectionStrategy, Component, computed, input, viewChild } from '@angular/core';

@Component({
   selector: 'app-colored-circle',
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
   <svg [attr.width]="diameter()" [attr.height]="diameter()">
      <circle r="50%" cx="50%" cy="50%" [attr.fill]="color()" />
      <text x="50%" y="50%" text-anchor="middle"  dy=".3em" [style]="textColor()">
         {{text()}}
      </text>
   </svg>
   `,
   styles: ``
})
export class ColoredCircle {
   diameter = input('23px');
   color = input<string>();
   text = input<string>('');

   textColor = computed(() => 'fill:' + contrast(this.color()));

}

/**
 * Calculate the contrast of a color to determine the appropriate opposing text color.
 * Takes a hex color string (with or withou leading #) and retruns 'black' or 'white depnding on 
 * hich contrats better.
 */
function contrast(hexColor: string): string {
   const [r, g, b] = hex2rgb(hexColor);

   // calculate contrast of color (standard grayscale algorithmic formula)
   const contrast = (Math.round(r * 299) + Math.round(g * 587) + Math.round(b * 114)) / 1000;

   return (contrast >= 128) ? 'black' : 'white';
}

/** Parse hex color string (with or without leading # ) */
function hex2rgb(hex: string): number[] {
   hex = hex.trim();
   hex = hex[0] === '#' ? hex.substr(1) : hex;

   const bigint = parseInt(hex, 16);
   const h: number[] = [];

   if (hex.length === 3) {
      h.push((bigint >> 4) & 255);
      h.push((bigint >> 2) & 255);
   } else {
      h.push((bigint >> 16) & 255);
      h.push((bigint >> 8) & 255);
   }
   h.push(bigint & 255);
   return h;
}