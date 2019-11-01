export interface FixtureTimeFilter {
   sat: boolean;
   sun: boolean;
   weekday: boolean;
}
export interface GradeFilter { name: string; enabled: boolean; distance: number; time: number; }

export interface FixtureFilter {
   time: FixtureTimeFilter;
   gradesEnabled: boolean;
   grades: GradeFilter[];
   likedOnly: boolean;
}
