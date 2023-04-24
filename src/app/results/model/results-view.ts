
type ResultsViewType = 'Splits' | 'Race' | 'Table' | 'SplitPos' | 'RacePos' | 'Simple' | 'PercentBehind';

export interface ResultsView {
   type: ResultsViewType;
   name: string;
   primary: boolean;
}

export const resultsViews: ResultsView[] = [
   { type: 'Splits', name: 'Splits', primary: true },
   { type: 'Race', name: 'Race', primary: true },
   { type: 'Table', name: 'Table', primary: true },
   { type: 'SplitPos', name: 'Split position', primary: false },
   { type: 'RacePos', name: 'Race Position', primary: false },
   { type: 'PercentBehind', name: 'Percent behind', primary: false },
   { type: 'Simple', name: 'Simple results', primary: false },
];
