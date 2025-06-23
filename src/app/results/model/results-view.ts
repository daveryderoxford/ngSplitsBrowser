
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
