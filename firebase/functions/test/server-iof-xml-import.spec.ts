import { parseIOFXMLEventData } from '../src/results/import/server-iof-xml-reader.js';
import { WrongFileFormat } from '../src/results/model/exception.js';
import { describe, it, expect } from 'vitest';


const V3_HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n<ResultList xmlns="http://www.orienteering.org/datastandard/3.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" iofVersion="3.0">';
const V3_FOOTER = '</ResultList>';

const V2_HEADER = '<?xml version="1.0" ?>\n<!DOCTYPE RESULTLIST SYSTEM "IOFdata.dtd">\n<ResultList> <IOFVersion version="2.0.3" />';
const V2_FOOTER = '</ResultList>';

describe('IOF XML Reader (Server-Side)', () => {

   describe('Format Recognition', () => {
      it('should throw WrongFileFormat for empty string', () => {
         expect(() => parseIOFXMLEventData("")).toThrowError(WrongFileFormat);
      });

      it('should throw WrongFileFormat for non-XML string', () => {
         expect(() => parseIOFXMLEventData("this is not xml")).toThrowError(WrongFileFormat);
      });

      it('should throw WrongFileFormat for XML that is not an IOF format', () => {
         expect(() => parseIOFXMLEventData("<root><item>1</item></root>")).toThrowError(WrongFileFormat);
      });

      it('should correctly identify and parse a valid v3.0 file', () => {
         const xml = `${V3_HEADER}
        <ClassResult>
          <Class><Name>M21E</Name></Class>
          <PersonResult>
            <Person><Name><Family>Doe</Family><Given>John</Given></Name></Person>
            <Result><Time>3600</Time><Status>OK</Status></Result>
          </PersonResult>
        </ClassResult>
      ${V3_FOOTER}`;
         const results = parseIOFXMLEventData(xml);
         expect(results.classes).toHaveLength(1);
         expect(results.classes[0].name).toBe('M21E');
      });

      it('should correctly identify and parse a valid v2.0.3 file', () => {
         const xml = `${V2_HEADER}
        <ClassResult>
          <ClassShortName>M21E</ClassShortName>
          <PersonResult>
            <Person><PersonName><Family>Doe</Family><Given>John</Given></PersonName></Person>
            <Result>
               <Time>60:00
               </Time><CompetitorStatus value="OK" />
            </Result>
          </PersonResult>
        </ClassResult>
      ${V2_FOOTER}`;
         const results = parseIOFXMLEventData(xml);
         expect(results.classes).toHaveLength(1);
         expect(results.classes[0].name).toBe('M21E');
      });
   });

   describe('IOF v3.0 Parsing', () => {
      const person1 = `
      <PersonResult>
        <Person><Name><Family>Smith</Family><Given>John</Given></Name></Person>
        <Organisation><ShortName>CLUB</ShortName></Organisation>
        <Result>
          <Time>3723</Time>
          <Status>OK</Status>
          <SplitTime><ControlCode>101</ControlCode><Time>123</Time></SplitTime>
          <SplitTime><ControlCode>102</ControlCode><Time>345</Time></SplitTime>
        </Result>
      </PersonResult>`;

      const person2 = `
      <PersonResult>
        <Person><Name><Family>Jones</Family><Given>Jane</Given></Name></Person>
        <Organisation><ShortName>CLUB</ShortName></Organisation>
        <Result>
          <Time>3850</Time>
          <Status>OK</Status>
          <SplitTime><ControlCode>101</ControlCode><Time>130</Time></SplitTime>
          <SplitTime><ControlCode>102</ControlCode><Time>355</Time></SplitTime>
        </Result>
      </PersonResult>`;

      const classResult = `
      <ClassResult>
        <Class><Name>W21E</Name></Class>
        <Course>
          <Name>W21E Course</Name>
          <Length>5000</Length>
          <Climb>150</Climb>
          <NumberOfControls>2</NumberOfControls>
        </Course>
        ${person1}
        ${person2}
      </ClassResult>`;

      const fullV3Xml = `${V3_HEADER}${classResult}${V3_FOOTER}`;

      it('should parse a class with multiple competitors', () => {
         const results = parseIOFXMLEventData(fullV3Xml);
         expect(results.classes).toHaveLength(1);
         expect(results.classes[0].competitors).toHaveLength(2);
      });

      it('should correctly parse competitor details', () => {
         const results = parseIOFXMLEventData(fullV3Xml);
         const competitor = results.classes[0].competitors[0];
         expect(competitor.name).toBe('John Smith');
         expect(competitor.club).toBe('CLUB');
         expect(competitor.totalTime).toBe(3723);
         expect(competitor.completed).toBe(true);
      });

      it('should correctly parse course details', () => {
         const results = parseIOFXMLEventData(fullV3Xml);
         const course = results.courses[0];
         expect(course.name).toBe('W21E Course');
         expect(course.length).toBe(5); // 5000m -> 5km
         expect(course.climb).toBe(150);
         expect(course.controls).toEqual(['101', '102']);
      });

      it('should correctly parse split times', () => {
         const results = parseIOFXMLEventData(fullV3Xml);
         const competitor = results.classes[0].competitors[0];
         // [0, 123, 345, 3723]
         expect(competitor.allOriginalCumulativeTimes).toEqual([0, 123, 345, 3723]);
      });
   });

   describe('IOF v2.0.3 Parsing', () => {
      const person1 = `
      <PersonResult>
        <Person><PersonName><Family>Runner</Family><Given>Test</Given></PersonName></Person>
        <Club><ShortName>V2CLUB</ShortName></Club>
        <Result>
          <Time>55:30</Time>
          <CompetitorStatus value="OK" />
          <CourseLength>4500</CourseLength>
          <SplitTime><ControlCode>31</ControlCode><Time>05:00</Time></SplitTime>
          <SplitTime><ControlCode>32</ControlCode><Time>15:00</Time></SplitTime>
        </Result>
      </PersonResult>`;

      const classResult = `
      <ClassResult>
        <ClassShortName>M40</ClassShortName>
        ${person1}
      </ClassResult>`;

      const fullV2Xml = `${V2_HEADER}${classResult}${V2_FOOTER}`;

      it('should parse a class with one competitor', () => {
         const results = parseIOFXMLEventData(fullV2Xml);
         expect(results.classes).toHaveLength(1);
         expect(results.classes[0].competitors).toHaveLength(1);
         expect(results.classes[0].name).toBe('M40');
      });

      it('should correctly parse competitor details', () => {
         const results = parseIOFXMLEventData(fullV2Xml);
         const competitor = results.classes[0].competitors[0];
         expect(competitor.name).toBe('Test Runner');
         expect(competitor.club).toBe('V2CLUB');
         expect(competitor.totalTime).toBe(3330); // 55:30
         expect(competitor.completed).toBe(true);
      });

      it('should correctly parse course details', () => {
         const results = parseIOFXMLEventData(fullV2Xml);
         const course = results.courses[0];
         expect(course.name).toBe('M40');
         expect(course.length).toBe(4.5); // 4500m -> 4.5km
         expect(course.climb).toBeNull();
         expect(course.controls).toEqual(['31', '32']);
      });

      it('should correctly parse split times', () => {
         const results = parseIOFXMLEventData(fullV2Xml);
         const competitor = results.classes[0].competitors[0];
         // [0, 300, 900, 3330]
         expect(competitor.allOriginalCumulativeTimes).toEqual([0, 300, 900, 3330]);
      });
   });
});
