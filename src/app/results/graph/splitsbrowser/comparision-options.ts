export interface ComparisionOption {
    nameKey: string;
    selector: (courseClassSet) => number;
    requiresWinner: boolean;
    percentage: string;
}

export const ALL_COMPARISON_OPTIONS: ComparisionOption[] = [
    {
        nameKey: "CompareWithWinner",
        selector: courseClassSet => courseClassSet.getWinnerCumTimes(),
        requiresWinner: true,
        percentage: ""
    },
    {
        nameKey: "CompareWithFastestTime",
        selector: courseClassSet => courseClassSet.getFastestCumTimes(),
        requiresWinner: false,
        percentage: ""
    }
];

// All 'Fastest time + N %' values (not including zero).
const FASTEST_PLUS_PERCENTAGES = [5, 25, 50, 100];

FASTEST_PLUS_PERCENTAGES.forEach(function (percent) {
    ALL_COMPARISON_OPTIONS.push({
        nameKey: "CompareWithFastestTimePlusPercentage",
        selector: courseClassSet => courseClassSet.getFastestCumTimesPlusPercentage(percent),
        requiresWinner: false,
        percentage: percent.toString()
    });
});
ALL_COMPARISON_OPTIONS.push({
    nameKey: "CompareWithAnyRunner",
    selector: null,
    requiresWinner: true,
    percentage: ""
});


