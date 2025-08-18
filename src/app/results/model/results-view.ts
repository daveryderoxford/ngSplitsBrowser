/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/

export type ResultsViewType = 'graph' | 'race' | 'table' | 'stats';

export interface ResultsView {
   type: ResultsViewType;
   name: string;
}

export const resultsViews: ResultsView[] = [
   { type: 'graph', name: 'Splits' },
   { type: 'race', name: 'Race'},
   { type: 'table', name: 'Table' },
   { type: 'stats', name: 'Stats'},
];
