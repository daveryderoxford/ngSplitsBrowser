import { Pipe, PipeTransform } from '@angular/core';
import { sbTime, TimeUtilities } from 'app/results/model';

/*
 * Format splitsbrowser time
*/
@Pipe({name: 'sbTime'})
export class STBimePipe implements PipeTransform {
  transform(time: sbTime): string {
    return TimeUtilities.formatTime(time);
  }
}
