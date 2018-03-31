export interface ChartType {
    nameKey: string;
    dataSelector: any;
    skipStart: boolean;
    yAxisLabelKey: string;
    isRaceGraph: boolean;
    isResultsTable: boolean;
    minViewableControl: number;
    indexesAroundDubiousTimesFunc: any;
}

export class ChartTypeClass {

    public static chartTypes = {
        SplitsGraph: {
            nameKey: "SplitsGraphChartType",
            dataSelector: function (comp, referenceCumTimes) {
                return comp.getCumTimesAdjustedToReference(referenceCumTimes).map(ChartTypeClass.secondsToMinutes);
            },
            skipStart: false,
            yAxisLabelKey: "SplitsGraphYAxisLabel",
            isRaceGraph: false,
            isResultsTable: false,
            minViewableControl: 1,
            indexesAroundDubiousTimesFunc: ChartTypeClass.getIndexesAroundDubiousCumulativeTimes
        },
        RaceGraph: {
            nameKey: "RaceGraphChartType",
            dataSelector: function (comp, referenceCumTimes) {
                return comp.getCumTimesAdjustedToReferenceWithStartAdded(referenceCumTimes).map(ChartTypeClass.secondsToMinutes);
            },
            skipStart: false,
            yAxisLabelKey: "RaceGraphYAxisLabel",
            isRaceGraph: true,
            isResultsTable: false,
            minViewableControl: 0,
            indexesAroundDubiousTimesFunc: ChartTypeClass.getIndexesAroundDubiousCumulativeTimes
        },
        PositionAfterLeg: {
            nameKey: "PositionAfterLegChartType",
            dataSelector: function (comp) { return comp.cumRanks; },
            skipStart: true,
            yAxisLabelKey: "PositionYAxisLabel",
            isRaceGraph: false,
            isResultsTable: false,
            minViewableControl: 1,
            indexesAroundDubiousTimesFunc: ChartTypeClass.getIndexesAroundDubiousCumulativeTimes
        },
        SplitPosition: {
            nameKey: "SplitPositionChartType",
            dataSelector: function (comp) { return comp.splitRanks; },
            skipStart: true,
            yAxisLabelKey: "PositionYAxisLabel",
            isRaceGraph: false,
            isResultsTable: false,
            minViewableControl: 1,
            indexesAroundDubiousTimesFunc: ChartTypeClass.getIndexesAroundDubiousSplitTimes
        },
        PercentBehind: {
            nameKey: "PercentBehindChartType",
            dataSelector: function (comp, referenceCumTimes) { return comp.getSplitPercentsBehindReferenceCumTimes(referenceCumTimes); },
            skipStart: false,
            yAxisLabelKey: "PercentBehindYAxisLabel",
            isRaceGraph: false,
            isResultsTable: false,
            minViewableControl: 1,
            indexesAroundDubiousTimesFunc: ChartTypeClass.getIndexesAroundDubiousSplitTimes
        },
        ResultsTable: {
            nameKey: "ResultsTableChartType",
            dataSelector: null,
            skipStart: false,
            yAxisLabelKey: null,
            isRaceGraph: false,
            isResultsTable: true,
            minViewableControl: 1,
            indexesAroundDubiousTimesFunc: null
        }
    };
    /**
* Converts a number of seconds into the corresponding number of minutes.
* This conversion is as simple as dividing by 60.
* @sb-param {Number} seconds - The number of seconds to convert.
* @sb-return {Number} The corresponding number of minutes.
*/
    private static secondsToMinutes(seconds: number | null): number | null {
        return (seconds === null) ? null : seconds / 60;
    }

    /**
    * Returns indexes around the given competitor's dubious cumulative times.
    * @sb-param {Competitor} competitor - The competitor to get the indexes for.
    * @sb-return {Array} Array of objects containing indexes around dubious
    *     cumulative times.
    */
    private static getIndexesAroundDubiousCumulativeTimes(competitor) {
        return competitor.getControlIndexesAroundDubiousCumulativeTimes();
    }

    /**
    * Returns indexes around the given competitor's dubious split times.
    * @sb-param {Competitor} competitor - The competitor to get the indexes for.
    * @sb-return {Array} Array of objects containing indexes around dubious split
    *     times.
    */
    private static getIndexesAroundDubiousSplitTimes(competitor) {
        return competitor.getControlIndexesAroundDubiousSplitTimes();
    }
}
