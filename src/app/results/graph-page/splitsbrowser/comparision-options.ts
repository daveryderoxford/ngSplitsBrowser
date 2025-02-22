import { CourseClassSet } from "app/results/model";

export interface ComparisionOption {
    nameKey: string;
    name: string;
    selector: (c: CourseClassSet) => number[];
    requiresWinner: boolean;
    percentage: string;
}

export const ALL_COMPARISON_OPTIONS: ComparisionOption[] = [
    {
        nameKey: "CompareWithWinner",
        name: "Winner",
        selector: courseClassSet => courseClassSet.getWinnerCumTimes(),
        requiresWinner: true,
        percentage: ""
    },
    {
        nameKey: "CompareWithFastestTime",
        name: "Fastest time",
        selector: courseClassSet => courseClassSet.getFastestCumTimes(),
        requiresWinner: false,
        percentage: ""
    }
];

// All 'Fastest time + N %' values (not including zero).
const FASTEST_PLUS_PERCENTAGES = [5, 25, 50, 100];

for (const percent of FASTEST_PLUS_PERCENTAGES) {
    ALL_COMPARISON_OPTIONS.push({
        nameKey: "CompareWithFastestTimePlusPercentage",
        name: "Fastest time plus" + percent.toString() + "%",
        selector: courseClassSet => courseClassSet.getFastestCumTimesPlusPercentage(percent),
        requiresWinner: false,
        percentage: percent.toString()
    });
}
ALL_COMPARISON_OPTIONS.push({
    nameKey: "CompareWithAnyRunner",
    name: "Specific runner",
    selector: null,
    requiresWinner: true,
    percentage: ""
});
