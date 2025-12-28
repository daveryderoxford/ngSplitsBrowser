import { describe, expect } from 'vitest';
import { Results } from '../model';
import { Repairer } from '../model/repairer';
import { parseSIHTMLData } from './si-html-reader';

describe('SIHTMLReader', () => {
   let results: Results;
   let resultsCoursesOnly: Results;

   beforeEach(async () => {
      // Fetch the HTML content using the proxy path configured in karma.conf.js
      const responseClasses = await fetch('/assets/test-data/si-html-data.html');
      const siHtmlClasses = await responseClasses.text();

      results = parseSIHTMLData(siHtmlClasses);
            if (results.needsRepair()) {
               Repairer.repairEventData(results);
            }
      //results.setDerivedData();
   });

   beforeEach(async () => {
      // Fetch the HTML content using the proxy path configured in karma.conf.js
      const responseCourses = await fetch('/assets/test-data/si-html-courses.html');
      const siHtmlCourses = await responseCourses.text();
      resultsCoursesOnly = parseSIHTMLData(siHtmlCourses);
      if (resultsCoursesOnly.needsRepair()) {
         Repairer.repairEventData(resultsCoursesOnly);
      }
     // results.setDerivedData();
   });

   it('should parse the event data correctly', () => {
      expect(results).toBeDefined();
   });

   it('should read the event name and date', () => {
      [results, resultsCoursesOnly].forEach(r => {
         expect(r.eventName).toBe('SE Middle Champs 2025 - BBC');
         expect(r.eventDate).toEqual(new Date('2025-11-16'));
      });
   });

   it('should read the correct number of classes and courses', () => {

      expect(results.allClasses.length).toBe(21);
      expect(results.allCourses.length).toBe(9);

      expect(resultsCoursesOnly.allClasses.length).toBe(9);
      expect(resultsCoursesOnly.allCourses.length).toBe(9);
   });

   it('should read all competitors', () => {
      // This number is based on a manual count of finishers and disqualified runners in the HTML
      const totalCompetitors = results.allClasses.reduce((sum, courseClass) => sum + courseClass.competitors.length, 0);
      expect(totalCompetitors).toBe(301);

      const totalCompetitorsCoursesOnly = resultsCoursesOnly.allClasses.reduce((sum, courseClass) => sum + courseClass.competitors.length, 0);
      expect(totalCompetitorsCoursesOnly).toBe(301);
   });


   it('should correctly parse a specific competitor', () => {
      const m12Class = results.allClasses.find(c => c.name === 'M12');
      expect(m12Class).toBeDefined();

      const competitor = m12Class.competitors.find(c => c.name === 'Hugh Scarbrough');
      expect(competitor).toBeDefined();
      expect(competitor.club).toBe('MV');
      expect(competitor.totalTime).toBe(1026); // 17:06
      expect(competitor.isDisqualified).toBe(false);

      // Check a disqualified competitor
      const m65Class = results.allClasses.find(c => c.name === 'M65-75');
      const dqCompetitor = m65Class.competitors.find(c => c.name === 'Dave Cussens');
      expect(dqCompetitor).toBeDefined();
      expect(dqCompetitor.isDisqualified).toBe(true);
      expect(dqCompetitor.isNonFinisher).toBe(true);
   });

   it('should correctly parse a specific competitor in courses only format', () => {
      const brownClass = resultsCoursesOnly.allClasses.find(c => c.name === 'Brown');
      expect(brownClass).toBeDefined();

      const competitor = brownClass.competitors.find(c => c.name === 'Ralph Scarbrough');
      expect(competitor).toBeDefined();
      expect(competitor.club).toBe('MV');
      expect(competitor.totalTime).toBe(2314);
      expect(competitor.isDisqualified).toBe(false);

      expect(brownClass.competitors.length).toBe(57);

   });
});
