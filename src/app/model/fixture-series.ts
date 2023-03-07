export type FixtureSeriesType = "league" | "multiday";

export interface FixtureSeries {
  name: string;
  type: FixtureSeriesType;
  fixtureIds: string[];
}

    
