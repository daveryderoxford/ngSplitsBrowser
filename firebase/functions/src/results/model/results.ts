import { Competitor } from "./competitor.js";
import { CourseClass } from "./course-class.js";
import { Course } from "./course.js";
import { calculatePositions } from './ranking.js';

export class Results {

  private allCompetitorsList: Competitor[] | undefined = undefined;
  
  /**
  * Contains all of the data for an event.
  * @sb-param {Array} classes - Array of CourseClass objects representing all of
  *     the classes of competitors.
  * @sb-param {Array} courses - Array of Course objects representing all of the
  *     courses of the event.
  * @sb-param {Array} warnings - Array of strings containing warning messages
  *     encountered when reading in the event data.
  */
  constructor(public allClasses: CourseClass[],
    public allCourses: Course[],
    public warnings: string[] = [],
    public eventName?: string,
    public eventDate?: Date) {}

  public get courses() {
    return this.allCourses.filter(c => !c.isScoreCourse);
  }

  public get classes() {
    return this.allClasses.filter(c => !c.course.isScoreCourse);
  }

  get allCompetitors(): Competitor[] {
    if (!this.allCompetitorsList) {
      const nonScoreClasses = this.classes.filter( c => !c.course.isScoreCourse);
      this.allCompetitorsList = [];
      
      nonScoreClasses.forEach((courseClass) => {
        this.allCompetitorsList = this.allCompetitorsList.concat(courseClass.competitors);
      });
    }
    return this.allCompetitorsList!;
  }

/**
* Sets derived data for each competitor in each class.
*
* This method should be called after reading in the event data but before
* attempting to plot it.
*/
  public setDerivedData() {
    this.determineTimeLosses();
    this.determineClassPositions();
    this.determineCoursePositions();
  }

  /**
  * Determines time losses for each competitor in each class.
  */
  public determineTimeLosses(): void {
    this.classes.forEach((courseClass) => {
      courseClass.determineTimeLosses();
    });
  }

  private determineClassPositions() {
    for (const courseClass of this.classes) {
      calculatePositions(courseClass.competitors, (comp, pos) => comp.classPosition = pos);
    }
  }

  private determineCoursePositions() {
    for (const course of this.courses) {
      calculatePositions(course.competitors, (comp, pos) => comp.coursePosition = pos);
    }
  }

  /**
  * Returns whether the event data needs any repairing.
  *
  * The event data needs repairing if any competitors are missing their
  * 'repaired' cumulative times.
  *
  * @sb-return {boolean} True if the event data needs repairing, false
  *     otherwise.
  */
  public needsRepair(): boolean {
    return this.classes.some((courseClass) => {
      return courseClass.competitors.some((competitor) => {
        return (competitor.allCumulativeTimes === null);
      });
    });
  }
}
