import { Competitor, Course, CourseClass, Results, sbTime, TimeUtilities, WrongFileFormat } from "../model";
import { parseCourseLength } from "./util";
import { parseHtml, HtmlQuery, HtmlElement } from "./html-query";
import { queryElement } from './xml-query';

export function parseSIHTMLData(data: string): Results {
  const reader = new SIHTMLReader(data);
  return reader.parseEventData();
}

const parseTime = TimeUtilities.parseTime;

interface CourseInfo {
  course: Course;
  courseClass: CourseClass;
}

interface HeaderInfo {
  timeIndex: number;
  startTimeIndex: number;
  splitsStartIndex: number;
  splitsIncrement: number;
  controlCodes: string[];
}

interface ClassIndices {
  name: string;
  value: number;
}

interface CourseData {
  name: string;
  classes: CourseClass[]
  length: number;
  climb: number; 
  controlCodes: string[];
}

class SIHTMLReader {
  private doc: HtmlQuery; // Use HtmlQuery for HTML documents

  constructor(private data: string) {
    this.doc = parseHtml(data);
  }

  public parseEventData(): Results {
    const eventName = this.readEventName();
    const eventDate = this.readEventDate();
    const competitorData = this.compDataFromScript();

    const classIndices = this.parseCourseClassDropdown();

    const {classes, courses } = this.readCoursesAndClasses(classIndices);

    this.readCompetitors(competitorData, classIndices, classes);

    return new Results(classes, courses, [], eventName, eventDate);
  }

  private readEventName(): string {
    return this.doc.find('h2').first().text().trim();
  }

  private readEventDate(): Date | undefined {
    const dateString = this.doc.find('h3').first().text().trim();
    if (dateString) {
      return new Date(dateString);
    }
    return undefined;
  }

  /** Parses comma separated competitor data from the getData method in the script tag */
  private compDataFromScript(): any[] {
    const scriptContent = this.doc.find('script:not([src])').text();
    const match = scriptContent.match(/function getData\(tableNumber\) \{([\s\S]*?)\}/);
    if (!match || !match[1]) {
      throw new WrongFileFormat("Could not find getData function in script tag.");
    }

    const functionBody = match[1];
    const returnStatements = functionBody.match(/return\s*(\[[\s\S]*?\]);/g);

    if (!returnStatements) {
      throw new WrongFileFormat("Could not parse data from getData function.");
    }

    const allData = returnStatements.map((stmt: string) => {
      const arrayString = stmt.replace(/return\s*/, '').replace(/;$/, '');
      // Using new Function() to parse the array literal string from the script block.
      // This is generally safer than direct eval as it executes in the global scope.
      const f = new Function(`return ${arrayString}`);
      return f();
    });

    return allData;
  }

  /** Creates Classes and associated course objects from a list of class names and indices */
  private readCoursesAndClasses(classIndices: ClassIndices[]): {classes: CourseClass[], courses: Course[];} {
    
    const classes: CourseClass[] = [];
    const uniqueCourses = new Map<string, CourseData>();

    for (const cls of classIndices) {
      const classIndex = cls.value;
      const headerData = this.determineColumnIndices(classIndex);

      const resultsBlock = this.doc.find(`#results-block${classIndex}`);
      const courseInfoText = resultsBlock.find('p.results-block-info').text().trim();
      const length = parseCourseLength(courseInfoText);
      const climb = parseCourseClimb(courseInfoText);

      const courseKey = `${length}-${climb}-${headerData.controlCodes.join(',')}`;

      const courseClass = new CourseClass(cls.name, headerData.controlCodes.length, []);
      let courseData = uniqueCourses.get(courseKey);
      if (!courseData) {
        // If course doesn't exist, create it and add the class.
        // TODO Course name needs to be set correctly either based on a count or courses read from the dialog
        const courseData = {
          name: cls.name,
          classes: [courseClass],
          length: length, 
          climb: climb,
          controlCodes: headerData.controlCodes,
        }
        uniqueCourses.set(courseKey, courseData);
      } else {
        // If course already exists, just add the new class to it.
        courseData.classes.push(courseClass);
      }

      classes.push(courseClass);
    }

    const courses = Array.from(uniqueCourses.values()).map( 
      d => new Course(d.name, d.classes, d.length, d.climb, d.controlCodes)
    );

    return { classes, courses };
  }

  private readCompetitors(
    rawData: any[],
    classIndices: ClassIndices[],
    classes: CourseClass[]) {

    let competitorOrder = 1;

    for (const cls of classIndices) {
      const classIndex = cls.value;
      const competitorData = rawData[classIndex];

      const oclass = classes.find( c => c.name === cls.name);

      if (!competitorData || !oclass) {
        continue;
      }

      const nameIndex = 2;
      const clubIndex = 3;
      const numControls = oclass.numControls;

      const { timeIndex, startTimeIndex, splitsStartIndex, splitsIncrement } = this.determineColumnIndices(classIndex);

       console.log(`Column indices.  Time index: ${timeIndex}. First split: ${splitsStartIndex} Split increment ${splitsIncrement}`)
      if (timeIndex === -1 || splitsStartIndex === -1) {
        continue; // Skip if we can't determine columns for this class
      }

      for (const compData of competitorData) {
        const name = compData[nameIndex];
        const club = (compData[clubIndex] || '').trim();
        const timeStr = compData[timeIndex];

        let startTime = 0;
        if (startTimeIndex !== -1) {
          startTime = compData[startTimeIndex];
        }

        let cumTimes: (sbTime | null)[] = [0];
        for (let i = splitsStartIndex; i < compData.length; i += splitsIncrement) {
          const timeField = compData[i];
          // Parse out cumulative time from splits cell
          if (typeof timeField === 'string' && timeField.includes('<br>')) {
            const parts = timeField.split('<br>');
            const cumulativeTimeStr = parts[1].replace(/<[^>]*>/g, '').trim();
            if (cumulativeTimeStr) {
              cumTimes.push(parseTime(cumulativeTimeStr));
            } else {
              cumTimes.push(null);
            }
          } else {
            cumTimes.push(null);
          }
        }

        const paddedCumTimes = this.nullPad(cumTimes, numControls+1);
      
        const competitor = Competitor.fromOriginalCumTimes(competitorOrder, name, club, 0, paddedCumTimes);

        if (typeof timeStr === 'string') {
          if (timeStr.includes('m') || timeStr.includes('d')) {
            competitor.disqualify();
            competitor.setNonFinisher();
          } else if (timeStr.includes('s')) {
            competitor.disqualify();
            competitor.setNonStarter();
          }
        }

        competitor.setClass(oclass);
        oclass.competitors.push(competitor);

        if (competitorOrder == 1) {
          printCompetitor(competitor);
        }

        competitorOrder++;
      }
    }
  }

  /** Returns  array padded */
  private nullPad<T>(array: Array<T>, len: number): (T|null)[] {
    const numPad = len - array.length;
    if (numPad > 0) {
      const padding: null[] = Array(numPad).fill(null);
      return [...array, ...padding]
    }  else {
      return [...array]
    }

  }

  /** Parses the course/class dropdown to determine the list of classes 
   * If only a list of courses exists then the classes will be set to the list of courses
  */
  private parseCourseClassDropdown(): ClassIndices[] {
    const courseNames = this.readOption('Courses');
    let classNames = this.readOption('Classes');
    const hasClasses = classNames.length > 0;

    if (!hasClasses) {
      // This is the course-only format
      classNames = courseNames;
    }

    return classNames;
  }

  private readOption(target: string): ClassIndices[] {
    const options: ClassIndices[] = [];

    let optgroup = this.doc.find(`optgroup[label="${target}"]`);

    if (optgroup.length > 0) {
      optgroup.find('option').each((_, el: HtmlElement) => {
        const qEl = queryElement(el);
        const index = parseInt(qEl.attr('value') ?? '', 10);
        options.push({ value: index, name: qEl.text().trim() });
      });
    } else {
      const allOption = this.doc.find(`option:contains("All ${target}")`);
      let optionElements: HtmlQuery;
      if (allOption.length > 0) {
        optionElements = allOption.nextAll('option');
      } else {
        // Fallback for no-optgroup format
        optionElements = this.doc.find('select#table-menu option');
      }

      // Parse option elements for 
      optionElements.each((_, el: HtmlElement) => {
        const qEl = queryElement(el);
        const value = qEl.attr('value') ?? '';
        if (value && !isNaN(parseInt(value, 10)) && parseInt(value, 10) !== -1) {
          const index = parseInt(value, 10);
          options.push({ value: index, name: qEl.text().trim() });
        }
      });
    }
    return options;
  }

  private determineColumnIndices(classIndex: number): HeaderInfo {
    let timeIndex = -1;
    let startTimeIndex = -1;
    let splitsStartIndex = -1;
    let splitsIncrement = 4; // Default value
    const controlCodes: string[] = [];

    const resultsBlock = this.doc.find(`#results-block${classIndex}`);
    const headerCells = resultsBlock.find('thead tr:first-child th');

    let firstSplitFound = false;
    headerCells.each((index, th: HtmlElement) => {
      const text = queryElement(th).text().trim();
      const match = text.match(/^\d+\s+(\d+)/);

      if (text === 'Time') {
        timeIndex = index + 1;
      } else if (text === 'Start Time') {
        startTimeIndex = index + 1;
      } else if (/^\d/.test(text)) { // This will match any header starting with a digit, like "1 65" or "1"
        if (match) {
          controlCodes.push(match[1]);
        }

        if (!firstSplitFound) {
          splitsStartIndex = index + 1;
          firstSplitFound = true;
          const colspan = queryElement(th).attr('colspan');
          if (colspan) {
            splitsIncrement = parseInt(colspan, 10);
          }
        }
      }
    });
    return { timeIndex, startTimeIndex, splitsStartIndex, splitsIncrement, controlCodes };
  }
}

function parseCourseClimb(courseInfo: string): number {
  if (!courseInfo) {
    return 0;
  }

  // Matches a number followed by "m" (for meters), ignoring case.
  const match = courseInfo.match(/(\d+)\s*m/i);

  if (match && match[1]) {
    return parseInt(match[1], 10);
  }

  return 0;
}

function printCompetitor(comp: Competitor) {
  const oclass = comp.courseClass;
  const course = oclass?.course;
  console.log(`Competitor:  ${comp.name}`);
  console.log(`.  Course/class ${oclass?.name}. ${course?.name}`);
  console.log(`.  Cumulative splits ${comp.allOriginalCumulativeTimes.join(', ')}`);

}