/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { CourseClassSet } from "app/results/model";

type KeyName = "CompareWithWinner" | "CompareWithFastestTime" | "CompareWithFastestTimePlusPercentage" | "CompareWithAnyRunner";

export interface ComparisionOption {
    nameKey: KeyName;
    name: string;
    selector: (c: CourseClassSet) => number[];
    requiresWinner: boolean;
    percentage: number;
}

export const ALL_COMPARISON_OPTIONS: ComparisionOption[] = [
    {
        nameKey: "CompareWithWinner",
        name: "Winner",
        selector: courseClassSet => courseClassSet.getWinnerCumTimes(),
        requiresWinner: true,
        percentage: 0
    },
    {
        nameKey: "CompareWithFastestTime",
        name: "Fastest time",
        selector: courseClassSet => courseClassSet.getFastestCumTimes(),
        requiresWinner: false,
        percentage: 0
    }
];

// All 'Fastest time + N %' values (not including zero).
const FASTEST_PLUS_PERCENTAGES = [5, 25, 50, 100];

for (const percent of FASTEST_PLUS_PERCENTAGES) {
    ALL_COMPARISON_OPTIONS.push({
        nameKey: "CompareWithFastestTimePlusPercentage",
        name: "Fastest plus " + percent.toString() + "%",
        selector: courseClassSet => courseClassSet.getFastestCumTimesPlusPercentage(percent),
        requiresWinner: false,
        percentage: percent
    });
}
ALL_COMPARISON_OPTIONS.push({
    nameKey: "CompareWithAnyRunner",
    name: "Specific runner",
    selector: null,
    requiresWinner: true,
    percentage: 0
});
