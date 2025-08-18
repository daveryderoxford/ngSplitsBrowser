import { Competitor, DubiousTimeInfo, sbTime } from "../../model";

type YAxisLabelKey = "SplitsGraphYAxisLabel" | "RaceGraphYAxisLabel" | "PositionYAxisLabel" | "PercentBehindYAxisLabel" | null;

/**  Data defing an individual chart type*/
export interface ChartType {
    nameKey: string;
    dataSelector: (c: Competitor, t?: sbTime[]) => number[];
    skipStart: boolean;
    yAxisLabelKey: YAxisLabelKey;
    isRaceGraph: boolean;
    isResultsTable: boolean;
    minViewableControl: number;
    indexesAroundDubiousTimesFunc: (c: Competitor) => DubiousTimeInfo[];
}

export interface ChartTypes {
    SplitsGraph: ChartType;
    RaceGraph: ChartType;
    PositionAfterLeg: ChartType;
    SplitPosition: ChartType;
    PercentBehind: ChartType;
    ResultsTable: ChartType;
}

export class ChartTypeClass {

    /** Static Object containing all chart types */
    public static chartTypes: ChartTypes = {
        SplitsGraph: {
            nameKey: "SplitsGraphChartType",
            dataSelector: (comp, referenceCumTimes) => {
                return comp.getCumTimesAdjustedToReference(referenceCumTimes).map(ChartTypeClass.secondsToMinutes);
            },
            skipStart: false,
            yAxisLabelKey: "SplitsGraphYAxisLabel",
            isRaceGraph: false,
            isResultsTable: false,
            minViewableControl: 1,
            indexesAroundDubiousTimesFunc: (comp) => ChartTypeClass.getIndexesAroundDubiousCumulativeTimes(comp)
        },
        RaceGraph: {
            nameKey: "RaceGraphChartType",
            dataSelector: (comp, referenceCumTimes) => {
                return comp.getCumTimesAdjustedToReferenceWithStartAdded(referenceCumTimes).map(ChartTypeClass.secondsToMinutes);
            },
            skipStart: false,
            yAxisLabelKey: "RaceGraphYAxisLabel",
            isRaceGraph: true,
            isResultsTable: false,
            minViewableControl: 0,
            indexesAroundDubiousTimesFunc: (comp) => ChartTypeClass.getIndexesAroundDubiousCumulativeTimes(comp)
        },
        PositionAfterLeg: {
            nameKey: "PositionAfterLegChartType",
            dataSelector: (comp) => comp.cumRanks,
            skipStart: true,
            yAxisLabelKey: "PositionYAxisLabel",
            isRaceGraph: false,
            isResultsTable: false,
            minViewableControl: 1,
            indexesAroundDubiousTimesFunc: (comp) => ChartTypeClass.getIndexesAroundDubiousCumulativeTimes(comp)
        },
        SplitPosition: {
            nameKey: "SplitPositionChartType",
            dataSelector: (comp) => comp.splitRanks,
            skipStart: true,
            yAxisLabelKey: "PositionYAxisLabel",
            isRaceGraph: false,
            isResultsTable: false,
            minViewableControl: 1,
            indexesAroundDubiousTimesFunc: (comp) => ChartTypeClass.getIndexesAroundDubiousSplitTimes(comp)
        },
        PercentBehind: {
            nameKey: "PercentBehindChartType",
            dataSelector: (comp, referenceCumTimes) => comp.getSplitPercentsBehindReferenceCumTimes(referenceCumTimes),
            skipStart: false,
            yAxisLabelKey: "PercentBehindYAxisLabel",
            isRaceGraph: false,
            isResultsTable: false,
            minViewableControl: 1,
            indexesAroundDubiousTimesFunc: (comp) => ChartTypeClass.getIndexesAroundDubiousSplitTimes(comp)
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
    private static getIndexesAroundDubiousCumulativeTimes(competitor: Competitor): DubiousTimeInfo[] {
        return competitor.getControlIndexesAroundDubiousCumulativeTimes();
    }

    /**
    * Returns indexes around the given competitor's dubious split times.
    * @sb-param {Competitor} competitor - The competitor to get the indexes for.
    * @sb-return {Array} Array of objects containing indexes around dubious split
    *     times.
    */
    private static getIndexesAroundDubiousSplitTimes(competitor: Competitor): DubiousTimeInfo[] {
        return competitor.getControlIndexesAroundDubiousSplitTimes();
    }
}
