import { Competitor, Course, CourseClass, Results, sbTime, TimeUtilities, WrongFileFormat } from "../model";
import { parseCourseLength } from "./util";
import { parseHtml, HtmlQuery, HtmlElement } from "./html-query";
import { queryElement } from './xml-query';

export function parseSIHTMLData(data: string): Results {
   const reader = new SIHTMLReader(data);
   return (reader.parseEventData());
}

const parseTime = TimeUtilities.parseTime;

interface CourseInfo {
   course: Course;
   courseClass: CourseClass;
}

class SIHTMLReader {
   private doc: HtmlQuery; // Use HtmlQuery for HTML documents

   constructor(private data: string) {
      this.doc = parseHtml(data);
   }

   public parseEventData(): Results {
      const eventName = this.readEventName();
      const eventDate = this.readEventDate();
      const rawData = this.readRawData();

      const courseList = this.readOption('Courses');
      let classList = this.readOption('Classes');
      const hasClasses = classList.length > 0;

      if (!hasClasses) {
         // This is the course-only format
         classList = courseList;
      }

      const courseDataMap = this.readCoursesAndClasses(classList);
      const courseClasses = Array.from(courseDataMap.values()).map(ci => ci.courseClass);

      this.readCompetitors(rawData, classList, courseDataMap, hasClasses);

      const courses = Array.from(courseDataMap.values()).map(ci => ci.course);
      return new Results(courseClasses, courses, [], eventName, eventDate);
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

   private readRawData(): any[] {
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

      const allData = returnStatements.map(stmt => {
         const arrayString = stmt.replace(/return\s*/, '').replace(/;$/, '');
         // This is a safe use of eval because we are parsing it from a file uploaded by the user
         // and it is self-contained within this function.
         // eslint-disable-next-line no-eval
         return eval(arrayString);
      });

      return allData;
   }

   private readCoursesAndClasses(classList: { value: string, name: string; }[]): Map<string, CourseInfo> {
      const courseDataMap = new Map<string, CourseInfo>();
      const uniqueCourses = new Map<string, Course>();

      for (const cls of classList) {
         const classIndex = parseInt(cls.value, 10);
         const resultsBlock = this.doc.find(`#results-block${classIndex}`);
         const headerCells = resultsBlock.find('thead tr:first-child th');
         const controlCodes: string[] = [];

         headerCells.each((index, th: HtmlElement) => {
            const text = queryElement(th).text().trim();
            const match = text.match(/^\d+\s+(\d+)/);
            if (match) {
               controlCodes.push(match[1]);
            }
         });

         const courseInfoText = resultsBlock.find('p.results-block-info').text().trim();
         const length = parseCourseLength(courseInfoText);
         const climb = parseCourseClimb(courseInfoText);

         // Create a unique key for the course based on its physical properties
         const courseKey = `${length}-${climb}-${controlCodes.join(',')}`;

         const courseClass = new CourseClass(cls.name, controlCodes.length, []);
         let course = uniqueCourses.get(courseKey);

         if (!course) {
            // If course doesn't exist, create it and add the class.
            course = new Course(cls.name, [courseClass], length, climb, controlCodes);
            uniqueCourses.set(courseKey, course);
         } else {
            // If course already exists, just add the new class to it.
            course.classes.push(courseClass);
         }

         courseDataMap.set(cls.value, { course, courseClass });
      }

      return courseDataMap;
   }

   private readCompetitors(rawData: any[],
      classList: { value: string, name: string; }[],
      courseDataMap: Map<string, CourseInfo>,
      hasClasses: boolean) {
         
      let competitorOrder = 1;

      for (const cls of classList) {
         const classIndex = parseInt(cls.value, 10);
         const competitorData = rawData[classIndex];
         const courseInfo = courseDataMap.get(cls.value);

         if (competitorData && courseInfo) {
            const nameIndex = 2;
            const clubIndex = 3;
            const timeIndex = hasClasses ? 5 : 6;
            const splitsStartIndex = hasClasses ? 8 : 10;

            for (const compData of competitorData) {
               const name = compData[nameIndex];
               const club = compData[clubIndex].trim(); // parseHtml already handled &nbsp;
               const timeStr = compData[timeIndex];

               const cumTimes: (sbTime | null)[] = [0];
               // Splits are every 4 columns
               for (let i = 8; i < compData.length; i += 4) {
                  for (let i = splitsStartIndex; i < compData.length; i += 4) {
                     const timeField = compData[i];
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
               }

               const competitor = Competitor.fromOriginalCumTimes(competitorOrder, name, club, 0, cumTimes);

               if (timeStr.includes('m') || timeStr.includes('d')) {
                  competitor.disqualify();
                  competitor.setNonFinisher();
               }

               if (timeStr.includes('s')) {
                  competitor.disqualify();
                  competitor.setNonStarter();
               }

               competitor.setClass(courseInfo.courseClass);
               courseInfo.courseClass.competitors.push(competitor);

               competitorOrder++;
            } // Competitor
         }
      } // Class
   }

   private readOption(target: string): { value: string, name: string; }[] {
      const options: { value: string, name: string; }[] = [];
      const optgroup = this.doc.find(`optgroup[label="${target}"]`);

      optgroup.find('option').each((index, el: HtmlElement) => {
         const value = queryElement(el).attr('value') ?? '';
         const name = queryElement(el).text().trim();
         options.push({ value, name });
      });

      return options;
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