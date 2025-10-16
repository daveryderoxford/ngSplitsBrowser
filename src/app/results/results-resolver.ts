import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { ResultsDataService } from './results-data.service ';
import { ResultsPageState } from './results-page-state';
import { ResultsViewType } from './model/results-view';

/** Iniciates loading of results based on URL parameters */
export const resultsResolver: ResolveFn<void> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
   const rd = inject(ResultsDataService);
   const ps = inject(ResultsPageState);

   const id = route.paramMap.get('id');
   const name = route.paramMap.get('name') ?? '';
   const dateStr = route.paramMap.get('date');
   const date = dateStr ? new Date(dateStr) : undefined;
   
   if (!id) {
      console.log(`ResultsResolver: Error URL parameters.  Missing id, uid or url. Parameters ${route.paramMap.toString()} }`);
      return;
   }
   
   // Set the page view to the currently 
   const segments = route.url.map(x => x.path);
   console.log(`ResultsResolver: Setting page view to ${segments[0]}`);
   ps.setDisplayedPage(segments[0] as ResultsViewType);
   rd.viewStoredEvent(id, name, date);
};
