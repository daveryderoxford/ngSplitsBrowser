export type FixtureSeriesType = "league" | "multi day";

export interface FixtureSeries {
  name: string;
  type: FixtureSeriesType;
  fixtureIds: string[];
}

    
