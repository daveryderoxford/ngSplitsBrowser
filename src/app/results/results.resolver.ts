
import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { take } from 'rxjs/operators';
import { Results } from "./model";
import { ResultsSelectionService } from "./results-selection.service";
import { ResultsDataService } from './results-data.service ';

@Injectable({
    providedIn: 'root',
})
export class ResultsResolver  {
      private rs = inject(ResultsDataService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Results> {

        const id = route.paramMap.get('id');
        // Returning Obsrvable of empty does not navigate

        // If Id not specified just return the current results
        if (!id) {
            return this.rs.selectedResults;
        } else {
            return this.rs.setSelectedEventByKey(id).pipe(take(1));
        }
    }
}

