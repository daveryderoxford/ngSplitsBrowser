import { NgModule, Pipe, PipeTransform } from "@angular/core";
import { Fixture, LatLong } from "app/model/fixture";

// import format from 'date-fns/format';
import { format, differenceInCalendarDays} from 'date-fns';
import { EventGrade } from 'app/model';

/**
 * Pipes to display fixture fields used for both
 */

/** Google maps link with directions from home location */
@Pipe({
   name: 'googleDirectionsURL',
   pure: true
})
export class GoogleDirectionsURLPipe implements PipeTransform {
   transform(fixture: Fixture, homeLocation: LatLong): string {

      if (!homeLocation || homeLocation === undefined || !fixture) {
         return "";
      }

      return "https://www.google.com/maps/dir/?api=1&origin=" + latLongStr(homeLocation)
         + "&destination= " + latLongStr(fixture.latLong);
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

/* 
Returns a streetmap URL to display OS map for StreetMap website.
UR is of the form https://streetmap.co.uk/loc/N52.038333,W4.578611
*/
@Pipe( {
   name: 'streetmapURL'
} )
export class StreetmapURLPipe implements PipeTransform {
   transform( fix: Fixture ): string {
      const l = fix.latLong;
      if (l.lng < 0) {
          return `https://streetmap.co.uk/loc/N${l.lat.toString()},W${(-l.lng).toString() }`;
      } else {
         return `https://streetmap.co.uk/loc/N${l.lat.toString()},E${( l.lng ).toString()}`;
      }
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

      const daysFrom = differenceInCalendarDays(d, new Date());

      if (daysFrom >= 7) {
         return format(d, "iii dd-MMM-yy");
      } else if (daysFrom <= 7 && daysFrom > 1) {
         return "Next " + format(d, "iii do");
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
   transform(distance: number): string {
      if (distance === -1) {
         return "";
      } else {
         return distance.toString();
      }
   }
}

@Pipe( {
   name: 'distancecolor',
   pure: true
} )
export class FixtureDistanceColorPipe implements PipeTransform {
   transform( distance: number ): string {

      if ( distance === -1 ) {
         return "#000000";
      } else if ( distance < 20 ) {
         return "#FF0000";
      } else if ( distance < 40 ) {
         return "#0000FF";
      } else {
         return "#000000";
      }
   }
}


@Pipe( {
   name: 'liked'
} )
export class LikedPipe implements PipeTransform {
   transform( eventId: string, likedEvents: string[] ): boolean {
      if ( !likedEvents ) { return false; }
      return likedEvents.includes( eventId );
   }
}

@Pipe( {
   name: 'gradeIconName'
} )
export class GradeIconNamePipe implements PipeTransform {
   transform( grade: EventGrade ): string {
      return 'grade-' + grade.toLowerCase();
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
      StreetmapURLPipe,
      FixtureDatePipe,
      EllipsisPipe,
      FixtureDistancePipe,
      FixtureDistanceColorPipe,
      LikedPipe,
      GradeIconNamePipe
   ],
   exports: [
      GoogleURLPipe,
      GoogleDirectionsURLPipe,
      BingURLPipe,
      StreetmapURLPipe,
      FixtureDatePipe,
      EllipsisPipe,
      FixtureDistancePipe,
      FixtureDistanceColorPipe,
      LikedPipe,
      GradeIconNamePipe
   ]
})
export class FilterPipeModuleModule {
}
