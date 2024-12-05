
type ResultsViewType = 'graph' | 'race' | 'table' | 'stats' | 'splitpos' | 'racepos' | 'percentbehind';

export interface ResultsView {
   type: ResultsViewType;
   name: string;
   primary: boolean;
}

export const resultsViews: ResultsView[] = [
   { type: 'graph', name: 'Splits', primary: true },
   { type: 'race', name: 'Race', primary: true },
   { type: 'table', name: 'Table', primary: true },
   { type: 'stats', name: 'Statistics', primary: false },
   { type: 'splitpos', name: 'Split position', primary: false },
   { type: 'racepos', name: 'Race Position', primary: false },
   { type: 'percentbehind', name: 'Simple results', primary: false },
];
