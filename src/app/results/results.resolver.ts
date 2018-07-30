import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Results } from "app/results/model";
import { Observable } from "rxjs";
import { ResultsSelectionService } from "./results-selection.service";

@Injectable({
    providedIn: 'root',
})
export class ResultsResolver implements Resolve<Results> {

    constructor(private rs: ResultsSelectionService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Results> {

        const id = route.paramMap.get('id');
        // Returning Obsrvable of empty does not navigate

        // If Id not specified just retrun the current results
        if (!id) {
            return this.rs.selectedResults;
        } else {
            return this.rs.setSelectedEventByKey(id).take(1);
        }
    }
}

