import { NgModule, Pipe, PipeTransform } from "@angular/core";
import { Fixture, LatLong } from "app/model/fixture";
import { differenceInCalendarDays, format } from "date-fns";

/**
 * Pipes to display fixture fields used for both
 */

/** Google maps link with directions from home location */
@Pipe({
   name: 'googleDirectionsURL',
   pure: true
})
export class GoogleDirectionsURLPipe implements PipeTransform {
   transform(latLong: LatLong, homeLocation: LatLong): string {

      if (!homeLocation || homeLocation === undefined) {
         return "";
      }

      return "https://www.google.com/maps/dir/?api=1&origin=" + latLongStr(homeLocation)
         + "&destination= " + latLongStr(latLong);
   }
}

@Pipe({
   name: 'googleURL',
   pure: true
})
export class GoogleURLPipe implements PipeTransform {
   transform(fix: Fixture): string {
      return "https://www.google.com/maps/search/?api=1&query=" +
         latLongStr(fix.latLong) + "&query_place_id=" + fix.area + "&zoom=11";
   }
}

@Pipe({
   name: 'bingURL',
   pure: true
})
export class BingURLPipe implements PipeTransform {
   transform(fix: Fixture): string {
      return 'https://www.bing.com/maps/?cp=' + latLongStr(fix.latLong, '~') + "&lvl=15&style=s&sp=" +
         latLongStr(fix.latLong, '_') + "_" + fix.area;
   }
}

/** Reformat ISO date into displayed date string */
@Pipe({
   name: 'fixturedate',
   pure: true
})
export class FixtureDatePipe implements PipeTransform {
   transform(date: string): string {

      // For the next week display days in the future
      const d = new Date(date);

      const daysFrom = differenceInCalendarDays(d, Date());

      if (daysFrom > 7) {
         return format(d, "ddd DD-MMM-YY");
      } else if (daysFrom <= 7 && daysFrom > 1) {
         return "Next " + format(d, "ddd Do");
      } else if (daysFrom === 1) {
         return "Tommorow ";
      } else if (daysFrom === 0) {
         return "Today ";
      }
   }
}

@Pipe({
   name: 'ellipsis'
})
export class EllipsisPipe implements PipeTransform {
   transform(val, args) {
      if (args === undefined) {
         return val;
      }

      if (val.length > args) {
         return val.substring(0, args) + '...';
      } else {
         return val;
      }
   }
}

@Pipe({
   name: 'distance'
})
export class FixtureDistancePipe implements PipeTransform {
   transform(distance: number) {
      if (distance === -1) {
         return "";
      } else {
         return distance.toString();
      }
   }
}

function latLongStr(loc: LatLong, seperator = ","): string {
   return loc.lat.toString() + seperator + loc.lng.toString();
}

@NgModule({
   declarations: [
      GoogleURLPipe,
      GoogleDirectionsURLPipe,
      BingURLPipe,
      FixtureDatePipe,
      EllipsisPipe,
      FixtureDistancePipe,
   ],
   exports: [
      GoogleURLPipe,
      GoogleDirectionsURLPipe,
      BingURLPipe,
      FixtureDatePipe,
      EllipsisPipe,
      FixtureDistancePipe,
   ]
})
export class FilterPipeModuleModule {
}
