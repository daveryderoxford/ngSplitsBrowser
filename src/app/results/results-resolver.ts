import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { ResultsPageState } from './results-page-state';
import { ResultsViewType } from './model/results-view';
import { ResultsDataService } from './results-data.service ';

/** Iniciates loading of results based on URL parameters */
export const resultsResolver: ResolveFn<void> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
   const rd = inject(ResultsDataService);
   const ps = inject(ResultsPageState);
   const dateStr = route.queryParamMap.get('date');

   const eventDetails = {
      key: route.paramMap.get('id'),
      date: dateStr ? new Date(dateStr) : undefined,
      name: route.queryParamMap.get('name') ?? '',
      url: route.queryParamMap.get('url')
   };

   if (!eventDetails.key) {
      console.log(`ResultsResolver: Error in URL parameters.  Missing id, Parameters ${JSON.stringify(route.paramMap.toString())} }`);
      return;
   } else if (eventDetails.key === 'online' && !eventDetails.url && eventDetails.url !== null) { // Added check for null
      console.log(`ResultsResolver: Error in URL parameters. Missing url for online event, Parameters ${JSON.stringify(route.paramMap)} }`);
      return;
   }

   // Set the page view to the currently
   const segments = route.url.map(x => x.path);
   ps.setDisplayedPage(segments[0] as ResultsViewType);
   rd.viewEvent(eventDetails);
};
